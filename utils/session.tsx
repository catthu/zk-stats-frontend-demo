import { useEffect, useState } from "react";
import { supabase } from "./api"
import { Session, User } from "@supabase/supabase-js";

export const useUser = () => {
  const [ user, setUser ] = useState<User | null>(null);
  const [ userData, setUserData ] = useState<any>();
  if (!supabase) {
    return;
    // TODO error
  }
  
  useEffect(() => {
    supabase?.auth.getUser().then(result => {
      setUser(result.data.user);
      
    
  })
  }, [setUser])

  useEffect(() => {
    if (user) {
      supabase?.from('users')
        .select('*')
        .eq('user_id', user.id)
        .then(result => setUserData(result.data ? result.data[0] : {}))
    }
  }, [user, setUserData])

  return {...user, username: userData?.username};
}

export const useSession = async () => {
  const [ session, setSession ] = useState<Session | null>();
  if (!supabase) {
    return;
    // TODO error
  }

  useEffect(() => {
    supabase?.auth.getSession().then((result) => setSession(result.data.session))
  }, [setSession])
  return session;
}
