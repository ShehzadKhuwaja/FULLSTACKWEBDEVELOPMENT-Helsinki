describe('blog app', () => {
    beforeEach(function() {
        cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
        const user = {
            name: 'testuser',
            username: 'testuser',
            password: 'testuser'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.visit('')
    })
    it('Login form is shown', () => {
        cy.contains('log in to application')
        cy.contains('username')
        cy.contains('password')
        cy.contains('login')
    })

    describe('Login', () => {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('testuser')
            cy.get('#password').type('testuser')
            cy.get('#login-button').click()

            cy.contains('testuser logged in')
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('testuser')
            cy.get('#password').type('testusermalicious')
            cy.get('#login-button').click()

            cy.get('#message')
                .should('contain', 'Wrong username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('when logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'testuser', password: 'testuser' })
        })

        describe('and a blog exists', function() {
            beforeEach(function() {
                cy.createBlog({
                    title: 'This is TDD',
                    author: 'Helsinki',
                    url: 'https://fullstackopen.com/en/part5/end_to_end_testing#cypress'
                })
            })

            it('user can like a blog', function() {
                cy.contains('view').click()
                cy.contains('like').click()
                cy.contains('likes 1')
            })

            it('the user who created a blog can delete it.', function() {
                cy.contains('view').click()
                cy.contains('remove').click()
            })

            describe('a second blog is created by a new user', function() {
                beforeEach(function() {
                    const user2 = {
                        name: 'testuser2',
                        username: 'testuser2',
                        password: 'testuser2'
                    }
                    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
                    cy.login({ username: 'testuser2', password: 'testuser2' })
                    cy.createBlog({
                        title: 'This is FULLSTACK',
                        author: 'me50',
                        url: 'https://fullstackopen.com/'
                    })
                })

                it('only the creator can see the delete button of a blog, not anyone else.', function() {
                    cy.contains('This is FULLSTACK').contains('view').click()
                    cy.contains('This is FULLSTACK').contains('remove')
                    cy.contains('This is TDD').contains('view').click()
                    cy.contains('This is TDD').should('not.contain', 'remove')
                })

                it('blogs are ordered according to likes with the blog with the most likes being first.', function() {
                    cy.contains('This is FULLSTACK').contains('view').click()
                    cy.contains('like').click()
                    cy.contains('This is TDD').contains('view').click()

                    cy.get('.bloginfo').eq(0).should('contain', 'This is FULLSTACK')
                    cy.get('.bloginfo').eq(1).should('contain', 'This is TDD')
                })
            })
        })

        it('A blog can be created', function() {
            cy.contains('create new blog').click()
            cy.get('#title-input').type('This is E2E Testing')
            cy.get('#author-input').type('mluukkai')
            cy.get('#url-input').type('https://fullstackopen.com/en/part5/end_to_end_testing#cypress')
            cy.get('#create-button').click()
            cy.contains('This is E2E Testing mluukkai')
        })
    })
})