describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Tester',
      username: 'Tester',
      password: '1234'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
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
      cy.login({ username: 'Tester', password: '1234' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#titleInput').type('Test Blog')
      cy.get('#authorInput').type('John Smith')
      cy.get('#urlInput').type('www.exampleblog.com')
      cy.get('.submitButton').click()
      cy.contains('Test Blog John Smith')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Test Blog',
          author: 'John Smith',
          url: 'www.exampleblog.com'
        })
      })

      it('the user can like a blog', function () {
        cy.get('.blogsList')
          .contains('Test Blog')
          .contains('show')
          .click()

        cy.get('.likes').contains('0')
        cy.get('.likes').contains('likes').click()
        cy.get('.likes').contains('1')

      })

      it('the user can delete a blog listing they created', function () {
        cy.get('.blogsList')
          .contains('Test Blog')
          .contains('show')
          .click()

        cy.get('.removeButton').click()
        cy.on('window:confirm', () => true)
        cy.get('.feedback').should('contain', 'Successfully removed Test Blog by John Smith')
        cy.get('.blogsList').should('not.contain', 'Test Blog')
      })

      it('only the user who created a blog listing can see its remove button', function () {
        cy.get('.logoutButton').click()

        const user = {
          name: 'Tester2',
          username: 'Tester2',
          password: '1234'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)

        cy.login({ username: 'Tester2', password: '1234' })

        cy.get('.blogsList')
          .contains('Test Blog')
          .contains('show')
          .click()

        cy.get('.blogsList').should('not.contain', '.removeButton')
      })

      it('the blogs are ordered according to the number of likes', function () {
        cy.get('.blogsList')
          .contains('Test Blog')
          .contains('show')
          .click()

        cy.get('.likes').contains('0')
        cy.get('.likes').contains('likes').click()
        cy.get('.likes').contains('1')

        cy.createBlog({
          title: 'Other Blog',
          author: 'Dave Jones',
          url: 'www.altblog.com'
        })

        cy.get('.blog').eq(0).should('contain', 'Test Blog')
        cy.get('.blog').eq(1).should('contain', 'Other Blog')

        cy.get('.blogsList')
          .contains('Other Blog')
          .contains('show')
          .click()

        cy.get('.likes').contains('0')
        cy.get('.likes').contains('likes').click()
        cy.get('.likes').contains('1')
        cy.get('.likes').contains('likes').click()
        cy.get('.likes').contains('1')

        cy.get('.blog').eq(0).should('contain', 'Other Blog')
        cy.get('.blog').eq(1).should('contain', 'Test Blog')


      })

    })
  })

})