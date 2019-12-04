// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const path = require("path");
const gmail_tester = require("gmail-tester");

module.exports = (on, config) => {

 
  on("task", {
    "gmail:check": async args => {
      const { from, to, subject } = args;
      const email = await gmail_tester.check_inbox(
        path.resolve(__dirname, "credentials.json"), 
        path.resolve(__dirname, "gmail_token.json"),
        subject, 
        from, 
        to, 
        10, // Poll interval (in seconds).
        30, // Maximum poll time (in seconds), after which we'll giveup
      { include_body: true }
      );
      if (email) {
        console.log("Email was found!");
      } else {
        console.log("Email was not found!");
      }
      return email;
    }
  });

  on("task", {
    "gmail:get-messages": async args => {
      const messages = await gmail_tester.get_messages(
        path.resolve(__dirname, "credentials.json"),
        path.resolve(__dirname, "gmail_token.json"),
        args.options
      );
      return messages;
    }
  });

 
};


