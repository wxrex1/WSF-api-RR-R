# TPs
## TP1
Créer les formatters xml et yml en s'appuyant sur l'architecture vue en cours

## TP2 : Gestion Version
- Gérer le versioning des routes au niveau d'un middleware.
- Faire en sorte de pouvoir configurer les versions autorisés grâce à un objet de paramétrage.
- Il faut s'assurer que la value de l'objet est de type **Router**
```js
const routerV1 = require('./routes/v1/users.js');
const routerV2 = require('./routes/v2/users.js');
app.use("/users", apiVersions({
    v1: routerV1,
    v2: routerV2,
}, "v2"));
```
## TP3 : Gestion Traduction
- Gérer la traduction via un middleware.
- Configurer la langue via le Header HTTP adéquat
- Ajouter une fonction **t** à la réponse correspondant à la fonction de traduction de i18next
```js
i18next.init({
    ...
});

app.use(negociate_trad(i18next));

app.get('/resources', (req, res) => {
    res.send(res.t('key'));
});
```

## TP4 : HATEOAS
- Permettre d'ajouter l'HATEOAS sur une route via un middleware
- Implémenter le cas où la value est une string
```js
hateoas({
  comments: "/comments",
  self: true,
  all: true,
  //pagination: true,
  verifyEmail: {
    path: "/verify-email",
    method: "POST",
  },
});
```