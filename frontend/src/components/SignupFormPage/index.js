import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [hasSubmit, setHasSubmit] = useState(false);
  // const [errors, setErrors] = useState([]);

  useEffect(() => {
    const errors = [];
    if (!firstName) errors.push("Please provide your first name");
    if (!lastName) errors.push("Please provide your last name");
    if (!email.includes('@')) errors.push("Please provide a valid email (between 4 and 30 characters)");
    if (!username.length < 3) errors.push("Usernames must be greater than 3 characters");
    if (password !== confirmPassword) errors.push("Passwords do not match");
    setValidationErrors(errors)
  }, [firstName, lastName, email, username, password, confirmPassword])

  //comment this back in after you make a logout button:
  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();

    setHasSubmit(true);

    if (validationErrors.length) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    }

    if (password === confirmPassword && !validationErrors.length) {
    //   setErrors([]);
      return dispatch(sessionActions.signup({ firstName, lastName, email, username, password }))
    //     .catch(async (res) => {
    //       const data = await res.json();
    //       if (data && data.message) setErrors([data.message]);
    //     });
    }
    // return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <div id='signup-form'>
      <div id='wrap-title'>
        <span id='signup-title'>Join Us!</span>
      </div>
      <form id='signup-content' onSubmit={handleSubmit}>

        <input
          id='firstname'
          type='text'
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
        <input
          id='lastname'
          type='text'
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
        <input
          id='email-sign'
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id='username-sign'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          id='password-sign'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          id='confirm-pass'
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {hasSubmit && validationErrors.length > 0 && (
        <div id='error-div'>
          The following errors were found:
          <ul id='error-list'>
          {validationErrors.map((error, idx) => <li id='errors' key={idx}>{error}</li>)}
          </ul>
        </div>
        )}

          <button id='signup-button' type="submit">Sign Up</button>

      </form>
    </div>
  );
}

export default SignupFormPage;
