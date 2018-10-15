---
title: 'Serverless Variables'
menuText: Variables
menuOrder: 10
description: 'How to use Serverless Variables to insert dynamic configuration info into your serverless.yml'
layout: Doc
gitLink: /docs/providers/google/guide/variables.md
---

# Google - Variables

The Serverless framework provides a powerful variable system which allows you to add dynamic data into your `serverless.yml`. With Serverless Variables, you'll be able to do the following:

- Reference & load variables from environment variables
- Reference & load variables from CLI options
- Recursively reference properties of any type from the same `serverless.yml` file
- Recursively reference properties of any type from other YAML / JSON files
- Recursively nest variable references within each other for ultimate flexibility
- Combine multiple variable references to overwrite each other

**Note:** You can only use variables in `serverless.yml` property **values**, not property keys. So you can't use variables to generate dynamic logical IDs in the custom resources section for example.

## Reference Properties In serverless.yml
To self-reference properties in `serverless.yml`, use the `${self:someProperty}` syntax in your `serverless.yml`. This functionality is recursive, so you can go as deep in the object tree as you want.

```yml
service: new-service
provider: google

custom:
  resource: projects/*/topics/my-topic

functions:
  first:
    handler: firstPubSub
    events:
      - event:
          eventType: providers/cloud.pubsub/eventTypes/topics.publish
          resource: ${self:custom.resource}
  second:
    handler: secondPubSub
    events:
      - event:
          eventType: providers/cloud.pubsub/eventTypes/topics.publish
          resource: ${self:custom.resource}
```

In the above example you're setting a global event resource for all functions by referencing the `resource` property in the same `serverless.yml` file. This way, you can easily change the event resource for all functions whenever you like.

## Reference Variables in other Files
You can reference variables in other YAML or JSON files.  To reference variables in other YAML files use the `${file(../myFile.yml):someProperty}` syntax in your `serverless.yml` configuration file. To reference variables in other JSON files use the `${file(../myFile.json):someProperty}` syntax. It is important that the file you are referencing has the correct suffix, or file extension, for its file type (`.yml` for YAML or `.json` for JSON) in order for it to be interpreted correctly. Here's an example:

```yml
# myCustomFile.yml
topic: projects/*/topics/my-topic
```

```yml
# serverless.yml
service: new-service
provider: google

custom: ${file(../myCustomFile.yml)} # You can reference the entire file

functions:
  hello:
    handler: pubSub.hello
    events:
      - event:
          eventType: providers/cloud.pubsub/eventTypes/topics.publish
          resource: ${file(../myCustomFile.yml):topic} # Or you can reference a specific property
  world:
      handler: pubSub.hello
      events:
          eventType: providers/cloud.pubsub/eventTypes/topics.publish
          resource: ${self:custom.topic} # This would also work in this case
```

In the above example, you're referencing the entire `myCustomFile.yml` file in the `custom` property. You need to pass the path relative to your service directory. You can also request specific properties in that file as shown in the `topic` property. It's completely recursive and you can go as deep as you want.  Additionally you can request properties that contain arrays from either YAML or JSON reference files.  Here's a YAML example for an events array:

```yml
myevents:
  - event:
      eventType: providers/cloud.pubsub/eventTypes/topic.publish
      resource: projects/*/topics/my-topic
```

and for JSON:
```json
{
  "myevents": [{
    "event" : {
      "eventType": "providers/cloud.pubsub/eventTypes/topic.publish",
      "resource" : "projects/*/topics/my-topic"
    }
  }]
}
```

In your serverless.yml, depending on the type of your source file, either have the following syntax for YAML
```yml
functions:
  hello:
    handler: pubSub.hello
    events: ${file(../myCustomFile.yml):myevents
```

or for a JSON reference file use this sytax:
```yml
functions:
  hello:
    handler: pubSub.hello
    events: ${file(../myCustomFile.json):myevents
```

**Note:** If the referenced file is a symlink, the targeted file will be read.

## Reference Variables in JavaScript Files

You can reference JavaScript files to add dynamic data into your variables.

References can be either named or unnamed exports. To use the exported `someModule` in `myFile.js` you'd use the following code `${file(../myFile.js):someModule}`. For an unnamed export you'd write `${file(../myFile.js)}`.

```javascript
// resources.js
module.exports.topic = () => {
   // Code that generates dynamic data
   return 'projects/*/topics/my-topic';
}
```

```js
// config.js
module.exports = () => {
  return {
    property1: 'some value',
    property2: 'some other value'
  }
}
```

```yml
# serverless.yml
service: new-service

provider: google

custom: ${file(../config.js)}

functions:
  first:
    handler: pubSub
    events:
      - event:
          eventType: providers/cloud.pubsub/eventTypes/topics.publish
          resource: ${file(../resources.js):topic} # Reference a specific module
```

You can also return an object and reference a specific property. Just make sure you are returning a valid object and referencing a valid property:

```javascript
// myCustomFile.js
module.exports.pubSub = () => {
   // Code that generates dynamic data
   return {
     resource: 'projects/*/topics/my-topic'
   };
}
```

```yml
# serverless.yml
service: new-service

provider: google

functions:
  first:
    handler: pubSub
    events:
      - event:
          eventType: providers/cloud.pubsub/eventTypes/topics.publish
          resource: ${file(../myCustomFile.js):pubSub.resource} # Reference a specific module
```

## Multiple Configuration Files

Adding many custom resources to your `serverless.yml` file could bloat the whole file, so you can use the Serverless Variable syntax to split this up.

```yml
resources:
  Resources: ${file(google-cloud-resources.json)}
```

The corresponding resources which are defined inside the `google-cloud-resources.json` file will be resolved and loaded into the `Resources` section.

## Migrating serverless.env.yml

Previously we used the `serverless.env.yml` file to track Serverless Variables. It was a completely different system with different concepts. To migrate your variables from `serverless.env.yml`, you'll need to decide where you want to store your variables.

**Using a config file:** You can still use `serverless.env.yml`, but the difference now is that you can structure the file however you want, and you'll need to reference each variable/property correctly in `serverless.yml`. For more info, you can check the file reference section above.

**Using the same `serverless.yml` file:** You can store your variables in `serverless.yml` if they don't contain sensitive data, and then reference them elsewhere in the file using `self:someProperty`. For more info, you can check the self reference section above.

**Using environment variables:** You can instead store your variables in environment variables and reference them with `env.someEnvVar`. For more info, you can check the environment variable reference section above.

Now you don't need `serverless.env.yml` at all, but you can still use it if you want. It's just not required anymore. Migrating to the new variable system is easy and you just need to know how the new system works and make small adjustments to how you store & reference your variables.