export default function Login() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input type='email' />
      <input type='password' name='' id='' />
    </form>
  );
}
