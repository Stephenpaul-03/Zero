# Starter Kits — Local development

## Local development

Run these commands from the project repository. Commands listed here were inspected, not executed as part of writing this page.

~~~sh
git clone --filter=blob:none --sparse https://github.com/Stephenpaul-03/Starter-Kits.git
cd Starter-Kits
git sparse-checkout set react-shadcn
cd react-shadcn
npm install
~~~

## Project notes

The folder names here follow the actual checkout. Run the chosen starter using its own package scripts. The node-cli test command is a placeholder that exits with an error, so it should be replaced when creating a real CLI; it is not a working test suite.

## Documentation sources

Prepared from the local repository README, package manifests, and the listed source folders on 13 November 2026.

- [Source repository](https://github.com/Stephenpaul-03/Starter-Kits)
- [README at the inspected revision](https://github.com/Stephenpaul-03/Starter-Kits/blob/632d53913f7743140877474bf817614648aa3acb/README.md)
