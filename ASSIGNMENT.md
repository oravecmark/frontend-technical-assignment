## 🧩 Frontend Technical Assignment

We're excited to get to know you — not just your technical skills, but how you think, learn, and approach problems. For us, character, motivation, drive, and a willingness to grow matter just as much as code.

This assignment is meant to give you a taste of what working with us feels like. Think of it more as a conversation starter than a test.

Remember: it's not about perfection. It's about showing your thought process, your curiosity, and your approach to learning and solving problems.

---

### 🗃️ What you'll get
Below is a link to a Figma file. There are 2 parts to it:

[Figma file](https://www.figma.com/design/TTNgFDV6QjMRMbkxatbG1c/FE---Home-assignment?node-id=5-8671&t=STaTNG3tW31Udddt-0)

1. **The onboarding flow:** this is the required portion of the assignment. It's highlighted in green in the Figma file.
2. **The rest of the application:** this is for you to pick and choose features from if you have time left.

### 🎯 What we expect
We want you to fork the repository and implement the following features:

#### Base features
- Form handling
  - Some input fields require data to be fetched from the API (use the `json-server` GET endpoints for this).
- Input validation
  - The form inputs should be validated and a basic error message displayed if some of them is invalid.
- Form submission
  - Once the whole form is filled out correctly, the user should be able to send the form data to the API (use the `json-server` POST endpoint for this).

#### Optional features
This part is not required. If you're done with the required functionality, it's up to you to choose what to do next.  You can either polish the onboarding flow, or pick a completely new part of the UI from the Figma file and implement that. This is your chance to show us what you got!

#### Technical requirements
- This repository is initialized with React, but if you prefer another FE framework, it's up to you. You can use any component library, CSS solution, framework, package or AI tooling.
- We're also using `json-server` for simulating an API. You can read more about it [here](https://www.npmjs.com/package/json-server).
    - Start the `json-server` with `npm run api:start`.
    - Reset the `json-server` to original data with `npm run api:reset`
    - Available endpoints:
        - POST `http://localhost:3001/submission` - submit the final form data to this endpoint. See existing entries in `db.json` for the required shape.
        - GET `http://localhost:3001/environment` - fetch available environments
        - GET `http://localhost:3001/region` - fetch available regions
        - GET `http://localhost:3001/industry` - fetch available industries
        - GET `http://localhost:3001/number-of-employees` - fetch available employee count ranges
        - GET `http://localhost:3001/country` - fetch available countries
        - GET `http://localhost:3001/color` - fetch available colors

- The onboarding flow should include proper validation.
- Data should be fetched from and submitted to the API (we're using TanStack Query in our team).
- The screens should be styled (we're using Tailwind in our team).

### 📥 Submission
1. Fork the repository
1. Create a pull request with your changes.
2. Add a simple README with:
    - How to install and run it.
    - Any notes about your approach.
3. Send us the link (if your repository is private, please add `@mbednarik-ohpen` and `@denis-rahl-ohpen` as collaborators).

That's it! Keep it simple and if you have any questions, please don't hesitate to reach out.

### 🔜 Next steps
- We will go over your submitted assignment.
- If everything looks fine, we'll invite you to a technical call.
  - No need to worry about this step. This is a time for you to walk us through your work. We’ll talk about your choices — why you built something a certain way, what alternatives you considered, what you might change with more time, and so on.
  - If you have a project you're particularly proud of, please send it to us before the call and we can talk about it too.
- We'll get back to you with feedback and decision.