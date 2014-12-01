var app = angular.module("datosApp", ["firebase", "highcharts-ng"]);

app.controller("DatosController", function($scope, $firebase) {
  $scope.temperaturaSeries = [];
  $scope.humedadSeries = [];
  $scope.proximidadSeries = [];
  // now we can use $firebase to synchronize data between clients and the server!
  var ref = new Firebase("https://arduinoapi.firebaseio.com/").child("datos");

  ref.on('value', function(dataSnapshot) {
      // store dataSnapshot for use in below examples.
      dataSnapshot.forEach(function(childSnapshot) {
          // key will be "fred" the first time and "wilma" the second time
          // var key = childSnapshot.key();
          // childData will be the actual contents of the child
          $scope.temperaturaSeries.push(parseInt(childSnapshot.val().temperatura));
          $scope.humedadSeries.push(parseInt(childSnapshot.val().humedad));
          $scope.proximidadSeries.push(parseInt(childSnapshot.val().proximidad));
       });
       
       var t = $scope.temperaturaSeries;
       $scope.chartConfig.series[0].data = t.slice(t.length - 20, t.length);
       var h = $scope.humedadSeries;
       $scope.chartConfig.series[1].data = h.slice(h.length - 20, h.length);
       var p = $scope.proximidadSeries;
       $scope.chartConfig.series[2].data = p.slice(p.length - 20, p.length);
  });
    
  var sync = $firebase(ref);
  $scope.list = sync.$asArray();
  
  $scope.chartSeries = [
    {"name": "Temperatura", "data": [], type: "line"},
    {"name": "Humedad", "data": [], type: "line"},
    {"name": "Proximidad", "data": [], type: "line"}
  ];

  $scope.chartConfig = {
    options: {
      chart: {
        type: 'line'
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      }
    },
    series: $scope.chartSeries,
    title: {
      text: 'Datos en tiempo real'
    },
    credits: {
      enabled: true
    },
    loading: false,
    size: {}
  }

  $scope.reflow = function () {
    $scope.$broadcast('highchartsng.reflow');
  };
});