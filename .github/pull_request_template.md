**Related Issue**
Reference to UserStory/Task goes here

**Changes**
Describe the changes done here

**Screenshots**
Add screenshot images as applicable here

**Code Coverage report**
Run UnitTests and paste the code coverage report here

**Checklist for code quality**
- [ ] No inline methods in render method
- [ ] No [Inline If with Logical && Operator](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator) 
- [ ] No [Inline If-Else with Conditional Operator](https://reactjs.org/docs/conditional-rendering.html#inline-if-else-with-conditional-operator)
- [ ] No binding - `this.onClickDiv = this.onClickDiv.bind(this);`. use arrow functions instead.
- [ ] No state inside component
- [ ] Used Text, Buttons, Icon and other components that are present in views/shared directory
- [ ] No inline styles
- [ ] all style names should be meaningful(name should indicate, why it is used rather than which component its styling.) 
- [ ] Names of variables are camel cased
- [ ] Used lodash functions where applicable.
- [ ] Always try to use `const`. There is a very good reason to use `let`
- [ ] All the strings are i18nised.
- [ ] No spelling mistakes
- [ ] Screen level components should have `<ScreenContainer>` as the root component. 
- [ ] Avoid using fixed width and height. Instead use `Flexbox`. There is a link to cheatSheet in ReadMe.

**Common lodash functions**
- [ ] Used `isEqual` instead of `===`
- [ ] Used `isUndefined` instead of `typeof name === 'undefined'`
