# Jira Transition
Transition Jira issue


This action is based on code from https://github.com/atlassian/gajira-transition and was forked to add these features:

* support for multiple issues

## Usage

> ##### Note: this action requires [Jira Login Action](https://github.com/marketplace/actions/jira-login)

Example transition action:

```yaml
- name: Transition issue
  id: transition
  uses: mat-technology/jira-issue-transition@master
  with:
    issues: RPR-181
    transition: "In progress"
}
```

The `issues` parameter can be an issue id created or retrieved by an upstream
action – for example,
[`Create`](https://github.com/marketplace/actions/jira-create) or [`Find Issue
Key`](https://github.com/marketplace/actions/jira-find). Here is full example
workflow:

```yaml
on:
  push

name: Test Transition Issue

jobs:
  test-transition-issue:
    name: Transition Issue
    runs-on: ubuntu-latest
    steps:
    - name: Login
      uses: atlassian/gajira-login@master
      env:
        JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
        JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
        JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}

    - name: Create new issue
      id: create
      uses: atlassian/gajira-create@master

    - name: Transition issue
      uses: mat-technology/jira-issue-transition@master
      with:
        issues: ${{ steps.create.outputs.issue }}
        transition: "In progress"
```
----
## Action Spec:

### Environment variables
- None

### Inputs
- `issues` (required) - list of issue keys to perform a transition on, as list or comma/space separated string
- `transition` - Case insensitive name of transition to apply. Example: `Cancel` or `Accept`
- `transitionId` - transition id to apply to an issue

### Outputs
- None

### Reads fields from config file at $HOME/jira/config.yml
- `issue`
- `transitionId`

### Writes fields to config file at $HOME/jira/config.yml
- None
