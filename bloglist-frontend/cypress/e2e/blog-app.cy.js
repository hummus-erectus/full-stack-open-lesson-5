describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Tester',
      username: 'Tester',
      password: '1234'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('.loginContainer')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Tester')
      cy.get('#password').type('1234')
      cy.contains('login').click()
      cy.contains('Tester logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('Tester')
      cy.get('#password').type('4321')
      cy.contains('login').click()
      cy.get('.feedback').should('contain', 'Wrong username or password')
      cy.get('.feedback').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('Tester')
      cy.get('#password').type('1234')
      cy.contains('login').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#titleInput').type('Test Blog')
      cy.get('#authorInput').type('John Smith')
      cy.get('#urlInput').type('www.exampleblog.com')
      cy.get('.submitButton').click()
      cy.contains('Test Blog John Smith')
    })
  })

})