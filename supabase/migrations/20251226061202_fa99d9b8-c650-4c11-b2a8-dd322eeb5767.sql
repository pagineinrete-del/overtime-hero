-- Create function to set admin for specific email
CREATE OR REPLACE FUNCTION public.set_admin_for_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user's email is the admin email
  IF NEW.email = 'pagineinre@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Assign default 'user' role to all other users
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  -- Create profile
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign roles on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_set_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_set_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.set_admin_for_email();