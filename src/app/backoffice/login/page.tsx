import { loginAction } from "./actions";

export default function Login() {
  return (
    <form action={loginAction}>
      <input type='email' name='email' placeholder='email' />
      <input type='password' name='password' placeholder='password' />
      <button type='submit'>Login</button>
    </form>
  );
}
