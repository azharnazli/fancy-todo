if (localStorage.getItem('token')) {
  $('#signOut').show()
  $('#signIn').hide()
  $('#register').hide()
  $('#todo').show()
  showTodo()
} else {
  $('#signOut').hide()
  $('#signIn').show()
  $('#register').show()
  $('#todo').hide()
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
      $('#signOut').show()
      $('#signIn').hide()
      $('#register').hide()
      $('#todo').show()
      removeform()
      clearVal()
    })
  showTodo()
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
    .done(response => {
      localStorage.setItem('token', response)
      removeform()
      clearVal()
      showTodo()
      $('#signOut').show()
      $('#signIn').hide()
      $('#register').hide()
      $('#todo').show()
    })
    .fail((jqXHR, textStatus) => {
      console.log(jqXHR)
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
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  $('#signIn').show()
  $('#register').show()
  $('#signOut').hide()
  $('#todo').hide()
  $('#your-todo').empty()

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
      console.log(response)
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
        title: `success add ${title}`
      })
      showTodo()
    })
    .fail((jqXHR, textStatus) => {let data = ''
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
        console.log(response)
        let data = ''
        if (response.length !== 0) {
          response.forEach(el => {
            let date = el.due_date.toString().slice(0, 10)
            data += `
          <div class="card-header">${date}</div>
          <div class="card-body mt-1" >
          <h5 class="card-title ">${el.title}</h5>
          <p class="card-text">${el.body}</p>`
            if (!el.finish) {
              data += `<a href="">finish</a>`
            } else {
              data += `<a href="" class="btn btn-disabled" >finish</a>`
            }
            data += `</div>`
          })
          data += ` 
        </div>
        </div>
        </div>`
          console.log(data)
          $('#your-todo').append(data)
        } else {
          $('#todo-card').hide()
        }
      })
      .fail((jqXHR, textStatus) => {
        console.log(`request failed ${textStatus}`)
      })
  }
}