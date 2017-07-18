# Release Process

The process is as follows:

1. A PR proposing a new release with a changelog since the last release
2. At least 2 or more [OWNERS](OWNERS) must LGTM this release
3. The release PR is closed
4. An OWNER runs `git tag -s $VERSION` and inserts the changelog and pushes the tag with `git push $VERSION`

## Publishing New App

A Release does not automatically mean that the Cabin application on the iOS and Android Stores will be updated

The community needs to determine how to do this without having a proliferation of apps on the stores. 
