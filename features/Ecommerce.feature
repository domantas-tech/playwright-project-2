Feature: Ecommerce validation

    As a user, I want to validate the ecommerce functionalities so that I can ensure a smooth shopping experience.

    Scenario: Validate product search functionality
        Given I login to Ecommerce application with valid credentials
        When Add "ZARA COAT 3" to the cart
        Then Verify "ZARA COAT 3" is displayed in the cart
        When Enter valid details and place the order
        Then verify order is present in the OrderHistory page
