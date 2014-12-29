var moulaXkcdStats = angular.module('moulaXkcdStats', ['ngResource']);

moulaXkcdStats.controller('moulaStatsController', ['$scope', '$resource',
  function($scope, $resource) {

    $scope.minY = function(array) {
      var minY = array[0].y;
      for (var i = 0; i < array.length; i++) {
        if (array[i].y < minY) {
          minY = array[i].y;
        }
      }
      return minY;
    }

    $scope.maxY = function(array) {
      var maxY = array[0].y;
      for (var i = 0; i < array.length; i++) {
        if (array[i].y > maxY) {
          maxY = array[i].y;
        }
      }
      return maxY;
    }

    function initAccounts(accountsMap) {
      accountsMap["AccountsReborn"] = [];
      accountsMap["AccountsTotal"] = [];
      accountsMap["AccountsUnused"] = [];
    }

    function initAges(agesMap) {
      agesMap["AgeLinks"] = [];
      agesMap["Neighbourhoods"] = [];
      agesMap["Ages"] = [];
      agesMap["PublicAges"] = [];
    }

    function initGeneralVault(generalVaultMap) {
      generalVaultMap["Avatars"] = [];
      generalVaultMap["KIimages"] = [];
      generalVaultMap["MarkerGames"] = [];
      generalVaultMap["TextNotes"] = [];
    }

    function initTechnicalVault(technicalVaultMap) {
      technicalVaultMap["StateObjects"] = [];
      technicalVaultMap["VaultNodeRefs"] = [];
      technicalVaultMap["VaultNodes"] = [];
    }

    $scope.accounts = new Map();
    initAccounts($scope.accounts);

    $scope.ages = new Map();
    initAges($scope.ages);

    $scope.generalVault = new Map();
    initGeneralVault($scope.generalVault);

    $scope.technicalVault = new Map();
    initTechnicalVault($scope.technicalVault);

    if ($scope.accounts["AccountsReborn"].length <= 0) {
      $resource("http://account.mystonline.com/stats/vstats.json").get(
        function(
          stats) {
          var count = 0;
          var tempAccounts = new Map();
          initAccounts(tempAccounts);

          var tempAges = new Map();
          initAges(tempAges);

          var tempGeneralVault = new Map();
          initGeneralVault(tempGeneralVault);

          tempTechnicalVault = new Map();
          initTechnicalVault(tempTechnicalVault);

          for (day in stats) {
            if (!isNaN(Date.parse(day))) {
              tempAccounts["AccountsReborn"].push({
                x: count,
                y: stats[day].AccountsReborn
              });
              tempAccounts["AccountsTotal"].push({
                x: count,
                y: stats[day].AccountsTotal
              });
              tempAccounts["AccountsUnused"].push({
                x: count,
                y: stats[day].AccountsUnused
              });

              tempAges["AgeLinks"].push({
                x: count,
                y: stats[day].AgeLinks
              });
              tempAges["Neighbourhoods"].push({
                x: count,
                y: stats[day].AvatarPublicAges
              });
              tempAges["Ages"].push({
                x: count,
                y: stats[day].Ages
              });
              tempAges["PublicAges"].push({
                x: count,
                y: stats[day].PublicAges
              });

              tempGeneralVault["Avatars"].push({
                x: count,
                y: stats[day].Avatars
              });
              tempGeneralVault["KIimages"].push({
                x: count,
                y: stats[day].KIimages
              });
              tempGeneralVault["MarkerGames"].push({
                x: count,
                y: stats[day].MarkerGames
              });
              tempGeneralVault["TextNotes"].push({
                x: count,
                y: stats[day].TextNotes
              });

              tempTechnicalVault["StateObjects"].push({
                x: count,
                y: stats[day].StateObjects
              });
              tempTechnicalVault["VaultNodeRefs"].push({
                x: count,
                y: stats[day].VaultNodeRefs
              });
              tempTechnicalVault["VaultNodes"].push({
                x: count,
                y: stats[day].VaultNodes
              });

              count++;
            }
          }

          $scope.accounts = tempAccounts;
          $scope.ages = tempAges;
          $scope.generalVault = tempGeneralVault;
          $scope.technicalVault = tempTechnicalVault;

        }

      )
    }
  }
]);

moulaXkcdStats.directive('moulaXkcdAccounts', function() {

  function link(scope, element, attrs) {

    scope.$watchCollection('accounts', function(newVal, oldVal) {
      if (newVal["AccountsReborn"].length > 0) {
        var plot = xkcdplot("Time", "Huge Amount", "Accounts");
        plot("body");

        // Add the lines.
        plot.plot(newVal["AccountsReborn"], {
          stroke: "blue",
          labelText: "Accounts Reborn"
        });
        plot.plot(newVal["AccountsTotal"], {
          stroke: "navy",
          labelText: "Accounts Total"
        });
        plot.plot(newVal["AccountsUnused"], {
          stroke: "aqua",
          labelText: "Accounts Unused"
        });
        // Render the image.

        var yMin = Math.min(scope.minY(newVal["AccountsReborn"]),
          scope.minY(newVal["AccountsTotal"]), scope.minY(newVal[
            "AccountsUnused"]));
        var yMax = Math.max(scope.maxY(newVal["AccountsReborn"]),
          scope.maxY(newVal["AccountsTotal"]), scope.maxY(newVal[
            "AccountsUnused"]));

        plot.xlim([-2, 8]).ylim([
          yMin, yMax
        ]).draw()
      }
    })
  };

  return {
    link: link
  };
});

moulaXkcdStats.directive('moulaXkcdAges', function() {

  function link(scope, element, attrs) {

    scope.$watchCollection('ages', function(newVal, oldVal) {
      if (newVal["Ages"].length > 0) {
        var plot1 = xkcdplot("Time", "Huge Amount", "Ages");
        plot1("body");
        //
        // // Add the lines.
        plot1.plot(scope.ages["AgeLinks"], {
          stroke: "springgreen",
          labelText: "Age Links",
          dyText: "13"
        });

        plot1.plot(scope.ages["Ages"], {
          stroke: "forestgreen",
          labelText: "Ages"
        });


        var yMin = Math.min(scope.minY(newVal["Ages"]),
          scope.minY(newVal["AgeLinks"]));
        var yMax = Math.max(scope.maxY(newVal["Ages"]),
          scope.maxY(newVal["AgeLinks"]));
        // Render the image.
        plot1.xlim([-2, 8]).ylim([yMin, yMax]).draw();

        var plot2 = xkcdplot("Time", "Amount", "Ages 2");
        plot2("body");
        plot2.plot(scope.ages["PublicAges"], {
          stroke: "lawngreen",
          labelText: "PublicAges"
        });
        plot2.plot(scope.ages["Neighbourhoods"], {
          stroke: "seagreen",
          labelText: "Neighbourhoods"
        });

        var yMin2 = Math.min(scope.minY(newVal["PublicAges"]),
          scope.minY(newVal["Neighbourhoods"]));
        var yMax2 = Math.max(scope.maxY(newVal["Neighbourhoods"]),
          scope.maxY(newVal["PublicAges"]));

        if (yMin2 < 300) {
          yMin2 = -1;
        }
        plot2.xlim([-2, 8]).ylim([yMin2, yMax2]).draw();

      }
    })
  };

  return {
    link: link
  };
});

moulaXkcdStats.directive('moulaXkcdGeneralVault', function() {

  function link(scope, element, attrs) {

    scope.$watchCollection('generalVault', function(newVal, oldVal) {
      if (newVal["Avatars"].length > 0) {

        var plot = xkcdplot("Time", "Huge Amount", "General Vault 1");
        plot("body");

        plot.plot(newVal["KIimages"], {
          stroke: "orange",
          labelText: "KI images"
        });

        plot.plot(newVal["TextNotes"], {
          stroke: "darkorange",
          labelText: "Text notes"
        });
        // Render the image.

        var yMin = Math.min(scope.minY(newVal["KIimages"]), scope.minY(
          newVal["TextNotes"]));
        var yMax = Math.max(scope.maxY(newVal["KIimages"]), scope.maxY(
          newVal["TextNotes"]));

        plot.xlim([-2, 8]).ylim([
          yMin, yMax
        ]).draw()

        var plot1 = xkcdplot("Time", "Large Amount",
          "General Vault 2");
        plot1("body");
        // Add the lines.
        plot1.plot(newVal["Avatars"], {
          stroke: "gold",
          labelText: "Avatars"
        });

        plot1.plot(newVal["MarkerGames"], {
          stroke: "yellow",
          labelText: "Marker Games"
        });

        var yMax1 = Math.max(scope.maxY(newVal["Avatars"]),
          scope.maxY(newVal["MarkerGames"]));

        plot1.xlim([-2, 8]).ylim([
          0, yMax1
        ]).draw()
      }
    })
  };

  return {
    link: link
  };
});

moulaXkcdStats.directive('moulaXkcdTechnicalVault', function() {

  function link(scope, element, attrs) {

    scope.$watchCollection('technicalVault', function(newVal, oldVal) {
      if (newVal["StateObjects"].length > 0) {
        var plot = xkcdplot("Time", "Huge Amount", "Technical Vault");
        plot("body");

        // Add the lines.
        plot.plot(newVal["StateObjects"], {
          stroke: "silver",
          labelText: "State Objects"
        });
        plot.plot(newVal["VaultNodeRefs"], {
          stroke: "slategrey",
          labelText: "Vault Node Refs"
        });
        plot.plot(newVal["VaultNodes"], {
          stroke: "dimgrey",
          labelText: "Vault Nodes"
        });
        // Render the image.

        var yMin = Math.min(scope.minY(newVal["StateObjects"]),
          scope.minY(newVal["VaultNodeRefs"]), scope.minY(newVal[
            "VaultNodes"]));
        var yMax = Math.max(scope.maxY(newVal["StateObjects"]),
          scope.maxY(newVal["VaultNodeRefs"]), scope.maxY(newVal[
            "VaultNodes"]));

        plot.xlim([-2, 8]).ylim([
          yMin, yMax
        ]).draw()
      }
    })
  };

  return {
    link: link
  };
});
