const { buildClientSchema, introspectionQuery } = require("graphql");
const fetch = require('node-fetch');
const addFile = require("node-plop/lib/actions/add").default;
const { generateQuery, getVarsToTypesStr } = require("./helpers");

module.exports = function(plop) {

  plop.setActionType('generateQuery', function (data, config, plop) {
        return new Promise((resolve, reject) => {
            fetch(data.endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: introspectionQuery })
            })
            .then(res => res.json())
            .then(res => {
                const gqlSchema = buildClientSchema(res.data);
                const promises = [];

                if (gqlSchema.getQueryType()) {
                    const obj = gqlSchema.getQueryType().getFields();
                    const description = 'Query';
                    Object.keys(obj).forEach((type) => {
                        const field = gqlSchema.getType(description).getFields()[type];
                        /* Only process non-deprecated queries/mutations: */
                        if (!field.isDeprecated) {
                          const queryResult = generateQuery(gqlSchema, type, description);
                          const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
                          let query = queryResult.queryStr;
                          query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
                          promises.push(addFile(Object.assign({}, data, { gql_type: type, gql: query }), config, plop));
                        }
                    });
                }

                return Promise.all(promises);
            })
            .then(() => resolve("Done!"))
            .catch(err => {
                console.log(err);
                reject('Error! Try again')
            })
        });
  });

  plop.setActionType('generateMutation', function (data, config, plop) {
    return new Promise((resolve, reject) => {
        fetch(data.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: introspectionQuery })
        })
        .then(res => res.json())
        .then(res => {
            const gqlSchema = buildClientSchema(res.data);
            const promises = [];

            if (gqlSchema.getMutationType()) {
                const obj = gqlSchema.getMutationType().getFields();
                const description = 'Mutation';
                
                Object.keys(obj).forEach((type) => {
                    const field = gqlSchema.getType(description).getFields()[type];
                    /* Only process non-deprecated queries/mutations: */
                    if (!field.isDeprecated) {
                      const queryResult = generateQuery(gqlSchema, type, description);
                      const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
                      let query = queryResult.queryStr;
                      query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
                      promises.push(addFile(Object.assign({}, data, { gql_type: type, gql: query }), config, plop));
                    }
                })
            }

            return Promise.all(promises);
        })
        .then(() => resolve("Done!"))
        .catch(err => {
            console.log(err);
            reject('Error! Try again')
        })
    });
  });

  plop.setActionType('generateGql', function (data, config, plop) {
    return new Promise((resolve, reject) => {
        fetch(data.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: introspectionQuery })
        })
        .then(res => res.json())
        .then(res => {
            const gqlSchema = buildClientSchema(res.data);
            const promises = [];

            if (gqlSchema.getQueryType()) {
                const obj = gqlSchema.getQueryType().getFields();
                const description = 'Query';

                Object.keys(obj).forEach((type) => {
                    const field = gqlSchema.getType(description).getFields()[type];

                    if (!field.isDeprecated) {
                      const queryResult = generateQuery(gqlSchema, type, description);
                      const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
                      let query = queryResult.queryStr;
                      query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
                      promises.push(addFile(Object.assign({}, data, { gql_type: type, gql: query }), config, plop));
                    }
                });
            }

            if (gqlSchema.getMutationType()) {
                const obj = gqlSchema.getMutationType().getFields();
                const description = 'Mutation';

                Object.keys(obj).forEach((type) => {
                    const field = gqlSchema.getType(description).getFields()[type];

                    if (!field.isDeprecated) {
                      const queryResult = generateQuery(gqlSchema, type, description);
                      const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
                      let query = queryResult.queryStr;
                      query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
                      promises.push(addFile(Object.assign({}, data, { gql_type: type, gql: query }), config, plop));
                    }
                });
            }

            return Promise.all(promises);
        })
        .then(() => resolve("Done!"))
        .catch(err => {
            console.log(err);
            reject('Error! Try again')
        });
    });
  });

  plop.setGenerator('react:connect', {
    description: 'Generate React Component to connect Graphql',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'add',
            path: 'graphql/connect/Connect.js',
            templateFile: 'plop-templates/react/Connect.hbs',
            force: true
        }
    ]
  });

  plop.setGenerator('react:component', {
    description: 'Generate React Component for Graphql Query and Mutation',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'generateQuery',
            path: 'graphql/queries/{{properCase gql_type}}.js',
            templateFile: 'plop-templates/react/Query.hbs',
            force: true
        },
        {
            type: 'generateMutation',
            path: 'graphql/mutations/{{properCase gql_type}}.js',
            templateFile: 'plop-templates/react/Mutation.hbs',
            force: true
        }
    ]
  });

  plop.setGenerator('react:all', {
    description: 'Generate React Component',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'add',
            path: 'graphql/connect/Connect.js',
            templateFile: 'plop-templates/react/Connect.hbs',
            force: true
        },
        {
            type: 'generateQuery',
            path: 'graphql/queries/{{properCase gql_type}}.js',
            templateFile: 'plop-templates/react/Query.hbs',
            force: true
        },
        {
            type: 'generateMutation',
            path: 'graphql/mutations/{{properCase gql_type}}.js',
            templateFile: 'plop-templates/react/Mutation.hbs',
            force: true
        }
    ]
  });

  plop.setGenerator('vue:connect', {
    description: 'Generate Vue file to connect Graphql',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'add',
            path: 'graphql/connect/vue-apollo.js',
            templateFile: 'plop-templates/vue/Connect.hbs',
            force: true
        }
    ]
  });

  plop.setGenerator('vue:component', {
    description: 'Generate Vue conponent for Graphql Query and Mutation',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'generateGql',
            path: 'graphql/gqls/{{properCase gql_type}}.gql',
            templateFile: 'plop-templates/vue/Gql.hbs',
            force: true
        },
        {
            type: 'generateQuery',
            path: 'graphql/queries/{{properCase gql_type}}.vue',
            templateFile: 'plop-templates/vue/Query.hbs',
            force: true
        },
        {
            type: 'generateMutation',
            path: 'graphql/mutations/{{properCase gql_type}}.vue',
            templateFile: 'plop-templates/vue/Mutation.hbs',
            force: true
        },
    ]
  });

  
};