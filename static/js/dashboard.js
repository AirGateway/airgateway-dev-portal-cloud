/******************/
/*    DASHBOARD   */
/******************/
$dashboardContainer = $('#dashboard-panel');
$dashboardInnerContainer = $('#dashboard-panel-inner');

var plans = [];
var selectedTimeWindow = 'day';
var lastPlanID = '';

if ($dashboardContainer.length) {
    var tplDashboardPlan = underscore.template($('#tpl_dashboard_plan').html());
    var tplDashboardPlanSelect = underscore.template($('#tpl_dashboard_plan_select').html());

    $.signedAjax({
        url: host + urlMap.plans,
        success: function (response) {
            for (var i in response.data) {
                if (response.data[i].status == 'active') {
                    plans.push(response.data[i]);
                }
            }

            renderPlanSelect();
        },
        error: function (result) {
            checkAndLogout(result)
        }
    });

    function renderPlanSelect() {
        if (plans.length) {
            $dashboardContainer.prepend(tplDashboardPlanSelect({
                plans: plans
            }));

            showPlan(plans[0].id);
        }
    }

    function showPlan(planID) {
        for (var i in plans) {
            if (plans[i].id === planID) {
                lastPlanID = planID;

                $.signedAjax({
                    url: host + urlMap.getStatsUrl + planID + '?type=api-usage,method-breakdown,method-breakdown-meantime,method-breakdown-percentage&time=' + selectedTimeWindow,
                    success: function (res) {
                        statsUrls = {
                            'api-usage': res["api-usage"],
                            'method-breakdown': res["method-breakdown"],
                            'method-breakdown-meantime': res["method-breakdown-meantime"],
                            'method-breakdown-percentage': res["method-breakdown-percentage"]
                        };

                        $dashboardInnerContainer.html(tplDashboardPlan({
                            id: plans[i].id,
                            name: plans[i].name,
                            short_description: plans[i].short_description,
                            rate: plans[i].rate,
                            per: plans[i].per,
                            quota_max: plans[i].quota_max,
                            quota_renewal_rate: plans[i].quota_renewal_rate,
                            url: plans[i].url,
                            auth_header: plans[i].auth_header,
                            key: plans[i].key,
                            statsUrls: statsUrls
                        }));
                    },
                    error: function (result) {
                        if (result.responseJSON) {
                            if (result.responseJSON.error === 'no consumer assigned') {
                                $dashboardInnerContainer.html('<div class="alert alert-danger">no consumer assigned</div>')
                            } else if (result.responseJSON.error === 'invalid token') {
                                localStorage.token = '';
                                location.reload();
                            }
                        }

                    }
                })

                /*generateChartForKey(planID, planID, true);
                generateChartForKey(planID, planID + "-method-breakdown-canvas", false);
                generateMeanResponseTimeChart(planID, planID + "-method-breakdown-meantime-canvas");
                generatePieChartForKey(planID, planID + "-method-breakdown-pie-canvas");
                generateLookToBookRatioChart(planID, planID + "-look-to-book-ratio-canvas");
                generateLookToBookLimitReachedChart(planID, planID + "-look-to-book-line-canvas");*/
                //generateChartForParticipants(planID, planID + "-aggregator", true);
                //generateChartForParticipants(planID, planID + "-agency", false);
            }
        }
    }

    function changeTime(time) {
        selectedTimeWindow = time;
        showPlan(lastPlanID)
    }
}