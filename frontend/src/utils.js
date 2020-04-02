import Swal from "sweetalert2";

const helpers = {
    Toast: Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    })
}

export default helpers