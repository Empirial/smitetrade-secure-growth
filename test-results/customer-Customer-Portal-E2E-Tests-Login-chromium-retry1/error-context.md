# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - heading "Customer Portal" [level=2] [ref=e10]
      - paragraph [ref=e11]: Welcome back to SMITETRADE
    - generic [ref=e12]:
      - generic [ref=e14]:
        - generic [ref=e15]:
          - img [ref=e16]
          - text: Incorrect email or password. Please try again.
        - generic [ref=e18]:
          - generic [ref=e19]:
            - text: Email
            - textbox "Email" [ref=e20]:
              - /placeholder: you@example.com
              - text: customer@test.smitetrade.co.za
          - generic [ref=e21]:
            - generic [ref=e22]:
              - generic [ref=e23]: Password
              - link "Forgot password?" [ref=e24] [cursor=pointer]:
                - /url: /forgot-password
            - textbox "Password" [ref=e25]: Test1234!
        - button "Sign In" [ref=e26] [cursor=pointer]
      - generic [ref=e28]:
        - text: Don't have an account?
        - link "Sign up" [ref=e29] [cursor=pointer]:
          - /url: /customer/signup
    - link "← Back to Main Site" [ref=e31] [cursor=pointer]:
      - /url: /
```