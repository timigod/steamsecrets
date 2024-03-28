const SteamUser = require('steam-user');
const readline = require('readline');
const client = new SteamUser();

const logOnOptions = {
  accountName: '',
  password: ''
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
  console.log('Logged into Steam');
  client.enableTwoFactor((error, response) => {
    if (error) {
      console.error('Error enabling two-factor:', error);
      return;
    }
    console.log('Two-factor setup initiated. Please wait...');

    // Logging the secrets for you to save elsewhere
    if (response.shared_secret) {
      console.log('Shared Secret:', response.shared_secret);
      // Ensure to save the shared_secret securely
    }
    if (response.identity_secret) {
      console.log('Identity Secret:', response.identity_secret);
      // Ensure to save the identity_secret securely
    }

    // Wait for the SMS code to finalize setup
    promptForSMSCode(response.shared_secret);
  });
});

function promptForSMSCode(shared_secret) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Please enter the SMS code: ', (smsCode) => {
    rl.close();
    client.finalizeTwoFactor(shared_secret, smsCode, (error) => {
      if (error) {
        console.error('Error finalizing two-factor setup:', error);
        return;
      }
      console.log('Mobile Authenticator setup complete.');
    });
  });
}
