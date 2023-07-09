TBA readme

This is a SST, Astro project.

# Secrets

JWT_SECRET

```
npx sst secrets set JWT_SECRET <secret>
```

# AWS Nuke

aws-nuke can be used to clean your aws account, it is a dangerous command and only should be ran if you want to delete everything in your aws account.

Make sure to install it [here]() and to copy the config file from the root of this project to aws-nuke.yml

```
npm run aws-nuke
```

will show you what it will remove

```
npm run aws-nuke -- --no-dry-run
```

will actually remove everything
