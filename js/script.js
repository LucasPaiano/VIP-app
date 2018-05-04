/*

HACER:

*cuando salgo y cambio de cliente, al poner nuevos puntos flashea que no es numerico, despues marca cualquier puntaje y al final no suma nada

*poner una opcion para recuperacion de pass

*chequear el ONE.click del redeem points

Ejemplo de objeto clientes

var obj1 = {'m': [{nombre: 'lucas',apellido:'paiano'},{nombre:'ezequiel',apellido:'filgueira'}],'f': [{nombre: 'estefi',apellido:'soldati'},{nombre:'vanesa',apellido:'domenez'}]}

HACER:

*Mensaje de error si no se selecciona ningun sexo

*un registro con fecha de cada transaccion que sumo puntos a un cliente

modal:

	$('<a/>')
				.html(albumes[i].name)
				.attr({href:'#modal', 'data-toggle': 'modal', id: albumes[i].id + 'linkAlbum'})
				.appendTo('#' + albumes[i].id)
				.on('click', dibujarModal);


*En createClient poner un mensaje que aparezca diciendo "el cliente no existe, desea registrarlo?"
 y con un boton que te lleve al modal

*/



var VipApp = (function (){

	var clients = {'m':[],'f':[]}; //guardar en el servidor

	var awards = []; //guardar en el servidor

	var clientSex;

	var clientLogged = false;

	var lastClientId;

	var lastClient;

	var lastAwardId = 0; //guardar en el servidor

	var managerLogged = false;

	var awardPositionInArray;


	function Client(id,sex,name,points,birthday,text) {

	this.id = id;
	this.sex = sex;
	this.name = name;
	this.points = points;
	this.birthday = birthday;
	this.text = text;

	}

	function Award(id,name,pointsRequired,text) {

	this.id = id;
	this.name = name;
	this.pointsRequired = pointsRequired;
	this.text = text;

	}

	var passCheck = function () {

		var password = 'negra';

		var inputPassword = $('#passwordInput').val();

		if (password === inputPassword) {

			$('#passwordScreen').addClass('hidden');

			$('#appScreen').removeClass('hidden');

		} else {

			$('#passwordInput').val('');

			alert('Contraseña incorrecta');

		}

	};


	var managerPassCheck = function () {

		var managerPassword = 'manager';

		var inputPassword = $('#managerPasswordInput').val();

		if (managerPassword === inputPassword) {

			managerLogged = true;

			$('#managerPasswordScreen').css('display','none');

			$('#managerLoggedOkScreen').fadeIn();

			$('#configTab').fadeIn();

			$('#managerLoggedAlert').fadeIn('slow');

			$('#ManagerOutTop').fadeIn('slow');

		} else {

			$('#managerPasswordInput').val('');

			alert('Contraseña incorrecta');

		}

	};

	var exitManager = function(){

		$('#managerPasswordInput').val('');

		$('#config').css('display','none');

		managerLogged = false;

		refreshAwards();

		$('#managerPasswordScreen').fadeIn();

		$('#managerLoggedOkScreen').css('display','none');

		$('#configTab').css('display','none');

		$('#managerLoggedAlert').fadeOut('slow');

		$('#ManagerOutTop').fadeOut('slow');

	};

	var renderDataTop = function(){
		if (clientLogged !== false) {
			$('#clientNameTop').html(clientLogged.name);
			$('#clientPointsTop').html(clientLogged.points + ' pts.');
			$('.clientDataTop').fadeIn('slow');
		} else if (clientLogged === false) {
			$('.clientDataTop').fadeOut('slow');
		}
	};


	var checkClientSex = function () {

		if ($('#checkboxM' + ':checked').length !== 0 && $('#checkboxF' + ':checked').length !== 0)  {

		alert('ERROR: Ambos sexos seleccionados simultáneamente');

		clientSex = null;

		} else if ($('#checkboxM' + ':checked').length !== 0)  {

		clientSex = 'm';

		} else if ($('#checkboxF' + ':checked').length !== 0) {

		clientSex = 'f';

		}

	};


	var askCreate = function () {

		$('#askCreateScreen').fadeIn();

	};


		//Para guardar el array en el local storage
	var saveClients = function () {

		var clientsString = JSON.stringify(clients);

		localStorage.setItem('clientsLocalStorage', clientsString);

	};

	var saveAwards = function () {

		awards.sort(comparePoints);

		var awardsString = JSON.stringify(awards);

		var lastAwardIdString = JSON.stringify(lastAwardId);

		localStorage.setItem('awardsLocalStorage', awardsString);

		localStorage.setItem('lastAwardIdLocalStorage', lastAwardIdString);

	};



	var drawClient = function (obj) {

		$('#askCreateScreen').css('display','none');

		$('#pointsAddedScreen').css('display','none');

		$('#newPointsScreen').css('display','block');

		$('#registeredTxtToDelete').empty();

		$('#mainScreen').css('display','none');

		$('#registeredClientScreen').fadeIn('slow');

		$('#clientName').html(obj.name);

		$('#clientBday').html(obj.birthday);

		$('#currentPoints').html(obj.points);

		$('#miscClientText').html(obj.text);

		lastClientId = obj.id;// borrar ?
		lastClient = obj; // borrar ?

		var newPoints;

		$('#redeemButton').on("click", function () {
				clientLogged = obj;
				$( "#awardsTab" ).trigger( 'click' );
				renderDataTop();
		});


			$('#okPoints').one("click", function (event) {

				if ($('#inputNewBuy').val().length !== 0 && isNaN($('#inputNewBuy').val()) === false) {

					newPoints = parseInt($('#inputNewBuy').val());

					obj.points = obj.points + newPoints;

					$('#currentPoints').empty();

					$('#currentPoints').html(obj.points);

					saveClients();

					$('#inputNewBuy').val('');

					$('#newPointsScreen').css('display','none');

					$('#pointsAddedScreen').fadeIn();

				} else { alert('ERROR: Debe ingresar un valor numérico');}

				renderDataTop();

			});



			$('#backToMainButton').on("click",function () {

				$('#registeredClientScreen').css('display','none');

				$('#mainScreen').fadeIn('slow');

				$('#inicialClientIdInput').val('');

				clientLogged = false;
				renderDataTop();
			});


	};


	var checkClient = function () {


		checkClientSex();

		var clientId = $('#inicialClientIdInput').val();

			var	checkId = function () {

				if (clientSex === 'm') {

					if (clients.m.length === 0) {

						askCreate();

					} else if (clients.m.length > 0) {

						var b = false;

						for (var i=0; i < clients.m.length && b === false; i++ ) {

							if (clientId === clients.m[i].id) {

								drawClient(clients.m[i]); //funcion para sumarle puntos al cliente

								b = true;

							} else if (clientId !== clients.m[i].id) {

								askCreate();
							}

						}

					 }

				}


				if (clientSex === 'f') {

					if (clients.f.length === 0) {

						askCreate();

					} else if (clients.f.length > 0) {

						var b = false;

						for (var i=0; i < clients.f.length && b === false; i++ ) {

							if (clientId === clients.f[i].id) {

								drawClient(clients.f[i]); //funcion para sumarle puntos al cliente

								b = true;

							} else if (clientId !== clients.f[i].id) {

								askCreate();
							}

						}

					 }

				};

			};


		checkId();

	};



	var createClient = function () {


		var newClient = new Client();

		newClient.id = $('#idClientInput').val();

		newClient.name = $('#nameClientInput').val();

		newClient.birthday = $('#bDayClientInput').val();

		newClient.text = $('#miscTextClientInput').val();

		newClient.points = 0;

		newClient.sex = clientSex;


		if (clientSex === 'm') {

			clients.m.push(newClient);

			saveClients();

		} else if (clientSex === 'f') {

			clients.f.push(newClient);

			saveClients();
		}

		//limpia los inputs
		$('#inicialClientIdInput').val('');

		$('.inputClientModal').val('');

		drawClient(newClient);

	};


	var createAward = function () {

		var newAward = new Award();

		newAward.id = lastAwardId + 1;

		newAward.name = $('#awardNameInput').val();

		newAward.pointsRequired = parseInt( $('#awardPointsInput').val() );

		newAward.text = $('#awardTextInput').val();

		lastAwardId++; //asi el siguiente premio tiene un nuevo id mayor este

		awards.push(newAward);

		saveAwards();

		renderAwards();

		//limpia los inputs
		$('.inputAwardModal').val('');

	};


	//Permite recuperar el listado de clientes en el formato original despues de haber recargado la pagina
	var loadClients = function () {
		//toma los datos del local storage en formato array
        var datos = localStorage.getItem('clientsLocalStorage');

        if (datos !== null) {
        	//si el array no esta vacio, los pasa a su formato original (objetos)
            clients = JSON.parse(datos);
    	}
    };

		var findClient = function(client) {

			var b = false;

			var clientPositionInArray;

			if (clientSex === 'm') {

				for (var i=0; i<clients.m.length && b===false ;i++) {

					if (clients.m[i].id === client.id) {

						clientPositionInArray = i;

						b = true;
					}
				}
			} else if (clientSex === 'f') {

					for (var a=0; a<clients.f.length && b===false ;a++) {

						if (clients.f[a].id === client.id) {

							clientPositionInArray = a;

							b = true;
						}
					}
				}

			return clientPositionInArray;

		};

		var getAward = function () {

				var pointsRequired = parseInt(this.id);

				var clientPositionInArray = findClient(clientLogged);

				if (clientSex === 'm') {
					clients.m[clientPositionInArray].points = clients.m[clientPositionInArray].points - pointsRequired;
					$('#currentPoints').html(clients.m[clientPositionInArray].points);
				} else if (clientSex === 'f') {
					clients.f[clientPositionInArray].points = clients.f[clientPositionInArray].points - pointsRequired;
					$('#currentPoints').html(clients.f[clientPositionInArray].points);
				}

				saveClients();
				renderAwards();
				renderDataTop();
		};

		var loadAwards = function () {

	        var datos = localStorage.getItem('awardsLocalStorage');

	        if (datos !== null) {

	            awards = JSON.parse(datos);
	    	}

					var datos2 = localStorage.getItem('lastAwardIdLocalStorage');

				if (datos2 !== null) {

						lastAwardId = JSON.parse(datos2);
			}

	  };

		var renderAwards = function() {

			if (awards.length > 0) {

				$('#awardsRow').empty();

				$('#awardsRowTittle').addClass('hidden');

				for ( var i=0; i < awards.length; i++) {

					$('<div/>')
						.attr('id','awardDiv'+awards[i].id) //ponerle un id para apendear el resto de las cosas
						.addClass('col-xs-12 col-sm-6 col-md-3 text-center')
						.appendTo('#awardsRow');

					$('<div/>')
						.addClass('awardBox')
						.attr('id','awardBox'+awards[i].id)
						.appendTo('#awardDiv' + awards[i].id);

					$('<h1/>')
						.addClass('awardTittle')
						.html(awards[i].name)
						.appendTo('#awardBox' + awards[i].id);

					$('<p/>')
						.addClass('awardPointsTxt')
						.html(awards[i].pointsRequired + ' ' + 'pts')
						.appendTo('#awardBox' + awards[i].id);

					$('<div/>')
						.addClass('awardMiscTxtBox')
						.attr('id','awardMiscDiv'+awards[i].id)
						.appendTo('#awardBox' + awards[i].id);

					$('<p/>')
						.addClass('awardMiscTxt')
						.html(awards[i].text)
						.appendTo('#awardMiscDiv' + awards[i].id);

					if(clientLogged !== false && clientLogged.points >= awards[i].pointsRequired){
							$('<button/>')
							.addClass('btn btn-success awardButton getAwardBtn')
							.html('CANJEAR')
							.attr('id',awards[i].pointsRequired)//{getAward(awards[i]);})  .on('click', getAward(awards[i])) ----- .on('click',{param1:awards[i]},getAward)  hacer: borrar comentarios
							.on('click', getAward)
							.appendTo('#awardBox' + awards[i].id);
						} else if (clientLogged !== false && clientLogged.points < awards[i].pointsRequired) {

							var missingPoints = awards[i].pointsRequired - clientLogged.points;

							$('<button/>')
							.addClass('btn btn-warning awardButton missingPointsBtn')
							.html('Faltan ' + missingPoints + ' puntos' )
							.appendTo('#awardBox' + awards[i].id);
						}

					$('<a/>')
					.attr({href:'#modalEditAward', 'data-toggle': 'modal', id: 'linkToModalEdit' + awards[i].id})
					.appendTo('#awardBox' + awards[i].id);


					if (managerLogged) {

						$('<button/>')
							.addClass('btn btn-default awardEditButton')
							.attr('id','editBtn'+awards[i].id)
							.on("click",editAward)
							.appendTo('#linkToModalEdit' + awards[i].id);

						$('<span/>')
							.addClass('glyphicon glyphicon-edit')
							.appendTo('#editBtn' + awards[i].id);

					}

				}

			};

		};


		var editAward = function(){

				$('.awardEditTextInput').val('');

				var idAwardToEdit = this.id.substring(7,this.id.length); // 7 son los primeros caracteres del id del boton "editBtn". lo que necesito es lo que sigue a continuacion, que es el id del premio seleccionado

				var b = false;
				for (var i=0; i<awards.length && b===false ;i++) {

					if (awards[i].id == idAwardToEdit) {

						awardPositionInArray = i;

						b = true;

					}
				}

				//carga los datos del premio a editar en el modal
				$('#awardEditNameInput').val(awards[awardPositionInArray].name);

				$('#awardEditPointsInput').val(awards[awardPositionInArray].pointsRequired);

				$('#awardEditTextInput').val(awards[awardPositionInArray].text);

		};

		var saveAwardEdition = function(){

			awards[awardPositionInArray].name = $('#awardEditNameInput').val();

			awards[awardPositionInArray].pointsRequired = parseInt( $('#awardEditPointsInput').val() );

			awards[awardPositionInArray].text = $('#awardEditTextInput').val();

			saveAwards();

			$('#awardsRow').empty();

			renderAwards();

		};

		var comparePoints = function (a,b) {

			var result;

			if (a.pointsRequired < b.pointsRequired) {

				result = -1;
			}

			if (a.pointsRequired === b.pointsRequired) {

				result = 0;
			}

			if (a.pointsRequired > b.pointsRequired) {

				result = 1;
			}

			return result;

		};


		var refreshAwards = function() {

			$('#awardsRow').empty();

			renderAwards();

		};

		var newBuy = function(){

			drawClient(lastClient);
			// $("#backToMainButton").trigger('click');
			//
			// $("#inicialClientIdInput").val(lastClientId);
			//
			// $("#checkClientButton").trigger('click');

		};



    //lo que se ejecutara una vez cargado el DOM
	var iniciar = function () {

		loadClients();

		loadAwards();

		renderAwards();

		$('#enterPass').on("click",passCheck);

		$("#passwordInput").keyup(function(e) {
			//si el codigo de la tecla presionada === 13 (enter). Se ejecuta la funcion
	       if(e.which === 13) {

	          passCheck();
	       }

   		 });


		$('#enterManagerPass').on("click",managerPassCheck);

		$("#managerPasswordInput").keyup(function(e) {
			//si el codigo de la tecla presionada === 13 (enter). Se ejecuta la funcion
	       if(e.which === 13) {

	          managerPassCheck();
	       }

   		 });


		$('#checkClientButton').on("click", function () {

			if ($('#checkboxM' + ':checked') || $('#checkboxM' + ':checked')) {

				checkClient();

			} else if ($('#checkboxM' + ':checked').length === 0 && $('#checkboxF' + ':checked').length === 0) {

				alert('ERROR: Debe seleccionar un sexo');

			}

		});


		$('#cancelCreate').on("click",function () {

			$('#askCreateScreen').fadeOut();

			$('#inicialClientIdInput').val('');

		});


		$('#cancelModal').on("click",function () {

			$('#inicialClientIdInput').val('');

		});

		//le da al id del modal un calor inicial igual al id ingresado en la pantalla principal
		$('#startCreateButton').on("click", function () {

			$('#askCreateScreen').fadeOut();

			$('#idClientInput').val($('#inicialClientIdInput').val());

		});


		$('#saveClientButton').on("click",createClient);

		$('.exitManagerButton').on("click",exitManager);

		$('#saveAwardButton').on("click",createAward);

		$('#saveEditionButton').on("click",saveAwardEdition);

		$('#awardsTab').on("click",refreshAwards);

		$('#newBuyBtn').on("click", newBuy);






	};


    return {

		iniciar: iniciar,

		clients: clients


    };


})();


$(document).ready(function () {

		$('#passwordScreen').fadeIn();

		VipApp.iniciar();

	}
);
