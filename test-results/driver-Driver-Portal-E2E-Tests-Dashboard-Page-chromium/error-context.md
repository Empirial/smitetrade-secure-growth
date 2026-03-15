# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - heading "Driver Portal" [level=2] [ref=e12]
      - paragraph [ref=e13]: Login to access delivery routes
    - generic [ref=e14]:
      - generic [ref=e16]:
        - generic [ref=e17]:
          - img [ref=e18]
          - text: Incorrect email or password. Please try again.
        - generic [ref=e20]:
          - generic [ref=e21]:
            - text: Email
            - textbox "Email" [ref=e22]:
              - /placeholder: driver@smitetrade.com
              - text: driver@test.smitetrade.co.za
          - generic [ref=e23]:
            - generic [ref=e24]:
              - generic [ref=e25]: Password
              - link "Forgot password?" [ref=e26] [cursor=pointer]:
                - /url: /forgot-password
            - textbox "Password" [ref=e27]: Test1234!
        - button "Start Shift" [ref=e28] [cursor=pointer]
      - generic [ref=e30]:
        - text: New Driver?
        - link "Register Here" [ref=e31] [cursor=pointer]:
          - /url: /driver/register
    - link "← Back to Main Site" [ref=e33] [cursor=pointer]:
      - /url: /
```