import { useState } from "react";
import { supabase } from "../services/supabaseClient";
// import type { ResponseError } from "@supabase/supabase-js";
export default function Auth() {
  const [loading, setLoading] = useState(false);
  // const [email, setEmail] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn({
        provider: 'discord',
      })
      if (error) throw error;
      const loggedUser:string = user?user.id:"";
      if (loggedUser.length != 0){
        setLoggedInUser(loggedUser);
      }
      alert("Check your email for the login link!");
    } catch (err) {
      //   alert(err.error_description || err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="row flex-center flex">
        <div className="col-6 form-widget" aria-live="polite">
          <h1 className="header">Login</h1>
          {loading ? (
            "Signing in..."
          ) : (
            <form onSubmit={handleLogin}>          
              <button className="button block" aria-live="polite">
                Sign-in with Discord
              </button>
            </form>
          )}
          {
            loggedInUser.length!=0?loggedInUser:undefined
          }
        </div>
      </div>
    </div>
  );
}
