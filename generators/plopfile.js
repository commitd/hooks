module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'Generate the component files',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name of Component (PascalCase)?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/components/{{name}}/{{name}}.tsx',
        templateFile: 'Component.hbs',
      },
      {
        type: 'add',
        path: '../src/components/{{name}}/{{name}}.stories.tsx',
        templateFile: 'Component.stories.hbs',
      },
      {
        type: 'add',
        path: '../src/components/{{name}}/{{name}}.test.tsx',
        templateFile: 'Component.test.hbs',
      },
      {
        type: 'add',
        path: '../src/components/{{name}}/index.ts',
        template: "export * from './{{name}}'\n",
      },
      {
        type: 'modify',
        path: '../src/components/index.ts',
        pattern: /\n*$/,
        template: `\nexport * from './{{name}}'\n`,
      },
    ],
  })
  plop.setGenerator('hook', {
    description: 'Generate the hook files',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name of the hook (e.g. usePascalCase)?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/hooks/{{name}}/{{name}}.ts',
        templateFile: 'Hook.hbs',
      },
      {
        type: 'add',
        path: '../src/hooks/{{name}}/{{name}}.stories.tsx',
        templateFile: 'Hook.stories.hbs',
      },
      {
        type: 'add',
        path: '../src/hooks/{{name}}/{{name}}.test.ts',
        templateFile: 'Hook.test.hbs',
      },
      {
        type: 'add',
        path: '../src/hooks/{{name}}/index.ts',
        template: "export * from './{{name}}'\n",
      },
      {
        type: 'modify',
        path: '../src/hooks/index.ts',
        pattern: /\n*$/,
        template: `\nexport * from './{{name}}'\n`,
      },
    ],
  })
}
