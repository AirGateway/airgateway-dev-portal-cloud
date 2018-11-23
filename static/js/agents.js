/******************/
/*    agents   */
/******************/
$agentsContainer = $('#agents-panel');
$agentsInnerContainer = $('.agent-table-body');

var agents = [];

if ($agentsContainer.length) {
  var tplAgentsTable = underscore.template($('#tpl_agents_table').html());

  $.signedAjax({
    url: host + urlMap.agents,
    success: function (response) {
      agents = response;
      if (!agents.length) {
        $('.agent-not-found').addClass('hide');
      }
      renderAgents();
    },
    error: function (result) {
      checkAndLogout(result)
    }
  });

  function renderAgents() {
    if (agents.length) {
      $agentsInnerContainer.append(tplAgentsTable({
        agents: agents
      }));
    }
  }

  function changeStatus(ob) {
    if (agents.length) {
      var id = $(ob).closest('tr').data('id');
      $.signedAjax({
        url: host + urlMap.setAgent,
        method: 'POST',
        data: JSON.stringify({id: id, type: 'status'}),
        success: function (response) {
          location.reload()
        }
      })
    }
  }

  function changeSuperagent(ob) {
    if (agents.length) {
      var id = $(ob).closest('tr').data('id');
      $.signedAjax({
        url: host + urlMap.setAgent,
        method: 'POST',
        data: JSON.stringify({id: id, type: 'superagent'}),
        success: function (response) {
          location.reload()
        }
      })
    }
  }

  function cancelInvite(ob) {
    if (agents.length) {
      var id = $(ob).closest('tr').data('id');
      $.signedAjax({
        url: host + urlMap.setAgent,
        method: 'POST',
        data: JSON.stringify({id: id, type: 'cancel-invite'}),
        success: function (response) {
          location.reload()
        }
      })
    }
  }

  function showInviteSent() {
    if (agents.length) {
      var email = $('#invite').val();
      $.signedAjax({
        url: host + urlMap.inviteAgent,
        method: 'POST',
        data: JSON.stringify({email: email}),
        success: function (response) {
          if (response.error) {
            $('.inviteSent').removeClass('hide').find('.panel-body').html(response.error.email);
          } else {
            location.reload();
          }
        }
      });
    }
  }
}
