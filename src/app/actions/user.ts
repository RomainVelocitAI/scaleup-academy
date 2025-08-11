'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// User role types
type UserRole = 'admin' | 'instructor' | 'student'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

// Update user role
export async function updateUserRole(email: string, newRole: UserRole) {
  try {
    const supabase = await createClient()
    
    // Check if current user has admin privileges
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Check current user's role
    const { data: currentUserProfile, error: currentUserError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (currentUserError || !currentUserProfile || currentUserProfile.role !== 'admin') {
      return { error: 'Insufficient permissions. Admin role required.' }
    }

    // First, get the user ID from the email in auth.users
    const { data: targetUser, error: userLookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (userLookupError || !targetUser) {
      // Try to find by auth.users email (using RPC function if available)
      // For now, we'll return an error
      return { error: `User with email ${email} not found` }
    }

    // Update the user's role
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', targetUser.id)
      .select()
      .single()

    if (updateError) {
      console.error('Update role error:', updateError)
      return { error: updateError.message }
    }

    // Revalidate relevant paths
    revalidatePath('/admin')
    revalidatePath('/admin/users')
    
    return { 
      success: true, 
      data: updatedProfile,
      message: `Successfully updated role for ${email} to ${newRole}`
    }
  } catch (error) {
    console.error('Update user role error:', error)
    return { error: 'Failed to update user role' }
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const supabase = await createClient()
    
    // Check if current user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Get user profile by email
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Get user error:', error)
      return { error: `User with email ${email} not found` }
    }

    return { data: profile }
  } catch (error) {
    console.error('Get user by email error:', error)
    return { error: 'Failed to get user' }
  }
}

// List all users (admin only)
export async function listUsers(
  page: number = 1, 
  limit: number = 10,
  roleFilter?: UserRole
) {
  try {
    const supabase = await createClient()
    
    // Check if current user has admin privileges
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Check current user's role
    const { data: currentUserProfile, error: currentUserError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (currentUserError || !currentUserProfile || currentUserProfile.role !== 'admin') {
      return { error: 'Insufficient permissions. Admin role required.' }
    }

    // Build query
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })

    // Apply role filter if provided
    if (roleFilter) {
      query = query.eq('role', roleFilter)
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit - 1
    
    const { data: users, error, count } = await query
      .range(start, end)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('List users error:', error)
      return { error: error.message }
    }

    return { 
      data: users,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('List users error:', error)
    return { error: 'Failed to list users' }
  }
}

// Bulk update user roles (admin only)
export async function bulkUpdateUserRoles(updates: { email: string, role: UserRole }[]) {
  try {
    const supabase = await createClient()
    
    // Check if current user has admin privileges
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Check current user's role
    const { data: currentUserProfile, error: currentUserError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (currentUserError || !currentUserProfile || currentUserProfile.role !== 'admin') {
      return { error: 'Insufficient permissions. Admin role required.' }
    }

    const results = []
    const errors = []

    for (const update of updates) {
      const result = await updateUserRole(update.email, update.role)
      if (result.error) {
        errors.push({ email: update.email, error: result.error })
      } else {
        results.push({ email: update.email, success: true })
      }
    }

    return { 
      results, 
      errors,
      message: `Updated ${results.length} users, ${errors.length} errors`
    }
  } catch (error) {
    console.error('Bulk update user roles error:', error)
    return { error: 'Failed to bulk update user roles' }
  }
}

// Grant admin access to specific user (convenience function)
export async function grantAdminAccess(email: string) {
  return updateUserRole(email, 'admin')
}

// Revoke admin access from specific user (convenience function)
export async function revokeAdminAccess(email: string) {
  return updateUserRole(email, 'student')
}

// Check if user has admin role
export async function checkUserIsAdmin(userId?: string) {
  try {
    const supabase = await createClient()
    
    // If no userId provided, check current user
    if (!userId) {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return { isAdmin: false }
      }
      userId = user.id
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return { isAdmin: false }
    }

    return { isAdmin: profile.role === 'admin' }
  } catch (error) {
    console.error('Check user admin error:', error)
    return { isAdmin: false }
  }
}

// Update user profile (self or admin)
export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string
    avatar_url?: string
    bio?: string
    [key: string]: any
  }
) {
  try {
    const supabase = await createClient()
    
    // Check if current user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Check if user is updating their own profile or is admin
    if (user.id !== userId) {
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (!currentUserProfile || currentUserProfile.role !== 'admin') {
        return { error: 'Insufficient permissions' }
      }
    }

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Update profile error:', updateError)
      return { error: updateError.message }
    }

    revalidatePath('/profile')
    revalidatePath('/admin/users')
    
    return { data: updatedProfile }
  } catch (error) {
    console.error('Update user profile error:', error)
    return { error: 'Failed to update profile' }
  }
}