  if (localStorage.getItem('token')) {
    $('#signOut').show()
    $('#signIn').hide()
    $('#register').hide()
    $('#todo').show()
    showTodo()
    setEmail()
    $('#member').show()
  } else {
    $('#signOut').hide()
    $('#signIn').show()
    $('#register').show()
    $('#todo').hide()
    $('#member').hide()
  }

  function clearVal() {
    event.preventDefault()
    $('#orangeForm-Fname').val('')
    $('#orangeForm-Lname').val('')
    $('#orangeForm-email').val('')
    $('#orangeForm-pass').val('')
    $('#defaultForm-email').val('')
    $('#defaultForm-pass').val('')
    $('#title').val('')
    $('#due-date').val('')
    $('#body').val('')
  }

  //checklogin
  function checkLogin() {
    if (!localStorage.getItem('token')) {
      $(`#modalLoginForm`).modal('show')
    } else {
      return true
    }
  }

  //remove form login
  function removeform() {
    $(`#modalLoginForm`).modal('hide')
    $(`#modalRegisterForm`).modal('hide')
  }

  // login and logout
  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/users/loginGoogle`,
        data: {
          token: id_token
        }
      })
      .done((response) => {
        localStorage.setItem('token', response)
        localStorage.setItem('email', profile.getEmail())
        profile.getEmail()
        $('#signOut').show()
        $('#signIn').hide()
        $('#register').hide()
        $('#todo').show()
        removeform()
        clearVal()
        setEmail()
        showTodo()
      })
      .fail((jqXHR, textStatus) => {
        console.log(`request failed ${textStatus}`)
      })
  }

  //normal SignIn
  function signIn() {
    event.preventDefault()
    let email = $('#defaultForm-email').val()
    let password = $('#defaultForm-pass').val()

    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/users/loginNormal`,
        data: {
          email,
          password
        }
      })
      .done((response) => {
        localStorage.setItem('token', response.token)
        localStorage.setItem('email', response.email)
        removeform()
        clearVal()
        setEmail()
        showTodo()
        $('#signOut').show()
        $('#signIn').hide()
        $('#register').hide()
        $('#todo').show()
      })
      .fail((jqXHR, textStatus) => {
        console.log(textStatus)
        let data = jqXHR.responseJSON.errors
        swal({
          title: "Error",
          text: data,
          icon: "error",
        });
      })
  }

  //sign out
  function signOut() {
    event.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    $('#signIn').show()
    $('#register').show()
    $('#signOut').hide()
    $('#todo').hide()
    $('#your-todo').empty()
    $("#member").empty()
    $("#member").hide('')
    clearVal()
  }

  //register
  function register() {
    event.preventDefault()
    let first_name = $('#orangeForm-Fname').val()
    let last_name = $('#orangeForm-Lname').val()
    let email = $('#orangeForm-email').val()
    let password = $('#orangeForm-pass').val()
    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/users/register`,
        data: {
          first_name,
          last_name,
          email,
          password
        }
      })
      .done(response => {
        removeform()
        clearVal()
      })
      .fail((jqXHR, textStatus) => {
        let data = ''
        for (let keys in jqXHR.responseJSON.errors) {
          data += `${jqXHR.responseJSON.errors[keys].message} \n`
        }

        swal({
          title: "Error",
          text: data,
          icon: "error",
        });
      })
  }

  // move from register to login
  function moveToLogin() {
    event.preventDefault()
    removeform()
    $(`#modalLoginForm`).modal('show')
  }

  function moveToRegister() {
    event.preventDefault()
    removeform()
    clearVal()
    $(`#modalRegisterForm`).modal('show')
  }

  //TODO
  function addTodo() {
    event.preventDefault()
    let title = $('#title').val()
    let due_date = $('#due-date').val()
    let body = $('#body').val()

    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/todos/addTodo`,
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          title,
          due_date,
          body
        }
      })
      .done(response => {
        clearVal()
        swal({
          title: `New Todo`,
          text: `${title}`
        })
        showTodo()
      })
      .fail((jqXHR, textStatus) => {
        let data = ''
        for (let keys in jqXHR.responseJSON.errors) {
          data += `${jqXHR.responseJSON.errors[keys].message} \n`
        }

        swal({
          title: "Error",
          text: data,
          icon: "error",
        });
        console.log(`request failed ${textStatus}`)
      })
  }

  //Todo Page
  function showTodo() {
    $('#your-todo').empty()
    if (event) {
      event.preventDefault()
    }
    if (checkLogin()) {
      $.ajax({
          url: `http://localhost:3000/todos/showAll`,
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .done(response => {
          let data = ''
          if (response) {
            response.forEach(el => {
              data += `
            <div class="card bg-light list-my-todo mb-2">
          <div id="listall-todo mb-1" >
          <div class="card-header mb-1">${new Date( el.due_date).toDateString()} ${new Date( el.due_date).toLocaleTimeString()}</div>
          <div class="card-body mt-1" >
          <h5 class="card-title mb-1">${el.title}</h5>
          <p class="card-text mb-1">${el.body}</p>`
              if (!el.finish) {
                data += `<a class="btn text-primary btn-md" onclick="finishTask('${(el._id)}')">Finish</a>`
              } else {
                data += `<a class="btn float-right btn-md text-danger" onclick="finishedTask('${(el._id)}')" >Clear</a>`
              }
              data += `
            </div>
            </div>
            </div>`
            })
            data += ` 
          
        </div>
        </div>
        </div>`
            $('#your-todo').append(data)
            loading = false

          } else {
            $('#todo-card').hide()
          }
        })
        .fail((jqXHR, textStatus) => {
          console.log(`request failed ${textStatus}`)
        })
    }
  }

  function finishTask(param) {
    event.preventDefault()
    $.ajax({
        method: 'PATCH',
        url: `http://localhost:3000/todos/finishTask/${param}`,
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .done(response => {
        showTodo()
      })
      .fail(err => {
        console.log(err)
      })
  }

  function finishedTask(param) {
    event.preventDefault()
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this todo!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          $.ajax({
              method: 'DELETE',
              url: `http://localhost:3000/todos/finishedTask/${param}`,
              headers: {
                token: localStorage.getItem('token')
              }
            })
            .done(response => {
              swal("todo has been deleted!", {
                icon: "success",
              });
              showTodo()
            })
            .fail(err => {
              console.log(err)
            })
        } else {
          swal("Your imaginary file is safe!");
        }
      });
  }

  function setEmail() {
    $("#member").empty()
    $("#member").append(localStorage.getItem('email'))
    $("#member").show('')
  }