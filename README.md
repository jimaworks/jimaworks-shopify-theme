# Making Changes to Jimaworks Shopify Theme

1. Use [ThemeKit](https://shopify.github.io/themekit/commands/) to copy any production changes to local: `theme download --env=production`.
2. Commit those changes to the repo: `git commit -am "Sync with prod"`
3. Make changes
4. Test on [Dev](https://jimaworks-dev.myshopify.com): `theme deploy --env=development`
5. If working, deploy to production: `theme deploy --env=production`