const _ = require('lodash')
const Jira = require('./common/net/Jira')

module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const { argv } = this

    var issueIds = argv.issues
      
    if (typeof issueIds === "string") {
      issueIds = issueIds.split(/ +| *, */)
    }
    console.log('Issue IDs found:.', issueIds)
    for (var issueId of issueIds) {
      await this.transitionIssue(issueId, argv.transitionId, argv.transition)
    }

    return {}
  }

  async transitionIssue (issueId, transitionId, transitionName) {
    const { transitions } = await this.Jira.getIssueTransitions(issueId)

    const transitionToApply = _.find(transitions, (t) => {
      if (t.id === transitionId) return true
      if (t.name.toLowerCase() === transitionName.toLowerCase()) return true
    })

    if (!transitionToApply) {
      console.log('Please specify transition name or transition id.')
      console.log(`Possible transitions for issue  ${issueId}:`)
      transitions.forEach((t) => {
        console.log(`{ id: ${t.id}, name: ${t.name} } transitions issue to '${t.to.name}' status.`)
      })
      return
    }

    console.log(`Selected transition: ${JSON.stringify(transitionToApply, null, 4)}`)

    await this.Jira.transitionIssue(issueId, {
      transition: {
        id: transitionToApply.id,
      },
    })

    const transitionedIssue = await this.Jira.getIssue(issueId)

    // console.log(`transitionedIssue:${JSON.stringify(transitionedIssue, null, 4)}`)
    console.log(`Changed ${issueId} status to : ${_.get(transitionedIssue, 'fields.status.name')} .`)
    console.log(`Link to issue: ${this.config.baseUrl}/browse/${issueId}`)

    return {}
  }

}
