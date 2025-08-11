-- Script SQL pour supprimer l'utilisateur romain.cano33@gmail.com
-- À exécuter dans Supabase SQL Editor ou via le MCP

-- 1. Récupérer l'ID de l'utilisateur
DO $$
DECLARE
    user_id_to_delete UUID;
    user_email TEXT := 'romain.cano33@gmail.com';
BEGIN
    -- Récupérer l'ID de l'utilisateur depuis auth.users
    SELECT id INTO user_id_to_delete
    FROM auth.users
    WHERE email = user_email;

    IF user_id_to_delete IS NULL THEN
        RAISE NOTICE 'Aucun utilisateur trouvé avec l''email: %', user_email;
    ELSE
        RAISE NOTICE 'Utilisateur trouvé avec ID: %', user_id_to_delete;
        
        -- Supprimer les données liées dans l'ordre (à cause des contraintes FK)
        
        -- Supprimer les progressions
        DELETE FROM public.user_progress WHERE user_id = user_id_to_delete;
        RAISE NOTICE 'Progressions supprimées';
        
        -- Supprimer les souscriptions
        DELETE FROM public.subscriptions WHERE user_id = user_id_to_delete;
        RAISE NOTICE 'Souscriptions supprimées';
        
        -- Supprimer les réponses de forum
        DELETE FROM public.forum_replies WHERE user_id = user_id_to_delete;
        RAISE NOTICE 'Réponses forum supprimées';
        
        -- Supprimer les topics de forum
        DELETE FROM public.forum_topics WHERE user_id = user_id_to_delete;
        RAISE NOTICE 'Topics forum supprimés';
        
        -- Supprimer les événements
        DELETE FROM public.events WHERE user_id = user_id_to_delete;
        RAISE NOTICE 'Événements supprimés';
        
        -- Supprimer le profil
        DELETE FROM public.profiles WHERE id = user_id_to_delete;
        RAISE NOTICE 'Profil supprimé';
        
        -- Supprimer l'utilisateur de auth.users
        DELETE FROM auth.users WHERE id = user_id_to_delete;
        RAISE NOTICE 'Utilisateur supprimé de auth.users';
        
        RAISE NOTICE 'Suppression complète terminée pour: %', user_email;
    END IF;
END $$;