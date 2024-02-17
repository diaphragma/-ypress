describe('SauceDemo Web UI Tests', () => {
    beforeEach(() => {
      cy.visit('https://www.saucedemo.com/')
    })

    Cypress.Commands.add('login', (username, password, timeout = 2000) => {
      cy.get('#user-name').type(username)
      cy.get('#password').type(password)
      cy.get('#login-button').click()
    })
    
    Cypress.Commands.add('addToCart', (index) => {
      cy.get('.inventory_item').eq(index).find('.btn_inventory').click()
    })
  
    it('1) Verify user login', () => {
      cy.login('standard_user', 'secret_sauce')
      cy.url().should('include', '/inventory.html')
      cy.get('.bm-burger-button').click() // Open the menu
      cy.get('.bm-menu').click()
      cy.get('#logout_sidebar_link').should('be.visible')
    })
  
    it('2) Verify user logout', () => {
      cy.login('standard_user', 'secret_sauce')
      cy.url().should('include', '/inventory.html')
      cy.get('.bm-burger-button').click()
      cy.get('.bm-menu').click()
      cy.get('#logout_sidebar_link').click()
      cy.url().should('eq', 'https://www.saucedemo.com/')
    })
  
    it('3) Verify invalid user login', () => {
      cy.login('invalid_user', 'invalid_password')
      cy.get('[data-test=error]').should('be.visible').and('contain.text', 'Username and password do not match any user in this service')
    })
  
    it('4) Verify Locked-out user login', () => {
      cy.login('locked_out_user', 'secret_sauce')
      cy.get('[data-test=error]').should('be.visible').and('contain.text', 'Sorry, this user has been locked out.')
    })
  
    it('5) Verify user login with long timeout', () => {
      cy.login('performance_glitch_user', 'secret_sauce', 10000) 
      cy.url().should('include', '/inventory.html')
      cy.get('.bm-burger-button').click()
      cy.get('.bm-menu').click()
      cy.get('#logout_sidebar_link').should('be.visible')
    })
  
    it('6) Verify that user can add item to cart', () => {
      cy.login('standard_user', 'secret_sauce')
      cy.addToCart(0)
      cy.get('.shopping_cart_badge').should('have.text', '1')
      cy.get('.shopping_cart_container').click()
      cy.contains('.inventory_item_name', 'Sauce Labs Backpack')
      cy.contains('.inventory_item_price', '$29.99')
      cy.get('#checkout').should('be.enabled')
    })
  
    it('7) Verify that user can buy item from cart', () => {
      cy.login('standard_user', 'secret_sauce')
      cy.addToCart(0) 
      cy.get('.shopping_cart_badge').click()
      cy.get('.cart_button').click()
      cy.get('#checkout').click()
      cy.get('#first-name').type('John')
      cy.get('#last-name').type('Doe')
      cy.get('#postal-code').type('12345')
      cy.get('#continue').click()
      cy.get('#finish').click()
      cy.contains('Thank you for your order!')
    })
  
    it('8) Verify that user can login with screen width less than 1060px', () => {
      cy.viewport(1059, 800)
      cy.login('standard_user', 'secret_sauce')
      cy.url().should('include', '/inventory.html')
    })
  })
  