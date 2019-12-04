/// <reference types="Cypress" />

const uuidv1 = require("uuid/v1");  // We will use it for our random password in the registration form.
const randomstring = require("randomstring");

describe("New user registration", async function() {

  it("Register Form: Email is delievered", function() {
    const test_id = randomstring.generate({length: 4, charset: 'alphanumeric'});
    const incoming_mailbox = `test+${test_id}@mydomain.com`;
    const password = randomstring.generate({length: 8, charset: 'alphanumeric'})

cy.visit('/')
cy.get(':nth-child(1) > .css-12ct4qh > .css-1owc35q').type(incoming_mailbox) // email
cy.get(':nth-child(2) > .css-12ct4qh > .css-1owc35q').type(password) // password
cy.get(':nth-child(3) > .css-12ct4qh > .css-1owc35q').type(password) //confirm password
cy.get('.css-1xsu5tz').click()
//polls inbox

cy.wait(3000)


cy.task("gmail:get-messages", {
  options: {
    from: "hello@mydomain.com",
    subject: "Confirm your account",
    to: incoming_mailbox,
    include_body: true
  }

}).then(emails => {
  assert.isAtLeast(
    emails.length,
    1,
    "Expected to find at least one email, but none were found!"
  );
  const emailbody = emails[0].body.html;
  assert.isTrue(
    emailbody.indexOf(
      "https://mydomain.com"
    ) >= 0,
    "Welcome to your account!"
    
  ) 
  ;})

cy.task("gmail:check", {
    from: "hello@mydomain.com",
    to: incoming_mailbox,
    subject: "Confirm your account"
  })
  .then(email => {
    assert.isNotNull(email, `Email was not found`);
  });
  console.log(email);

})
})