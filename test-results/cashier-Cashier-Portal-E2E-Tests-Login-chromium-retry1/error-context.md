# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - heading "Cashier Portal" [level=2] [ref=e12]
      - paragraph [ref=e13]: Login with your credentials
    - generic [ref=e14]:
      - generic [ref=e16]:
        - generic [ref=e17]:
          - generic [ref=e18]:
            - text: Email
            - textbox "Email" [ref=e19]:
              - /placeholder: cashier@smitetrade.com
              - text: cashier@test.smitetrade.co.za
          - generic [ref=e20]:
            - generic [ref=e21]:
              - generic [ref=e22]: Password
              - link "Forgot password?" [ref=e23] [cursor=pointer]:
                - /url: /forgot-password
            - textbox "Password" [active] [ref=e24]:
              - /placeholder: ••••
              - text: Test1234!
        - button "Login" [ref=e25] [cursor=pointer]
      - link "Register New Cashier" [ref=e28] [cursor=pointer]:
        - /url: /cashier/register
    - link "← Back to Main Site" [ref=e30] [cursor=pointer]:
      - /url: /
```