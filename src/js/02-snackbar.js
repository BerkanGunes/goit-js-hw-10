const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();
  
  const delay = parseInt(form.elements.delay.value);
  const state = form.elements.state.value;
  
  createPromise(delay, state)
    .then(value => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${value}ms`,
        position: 'topRight',
      });
    })
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${error}ms`,
        position: 'topRight',
      });
    });
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
