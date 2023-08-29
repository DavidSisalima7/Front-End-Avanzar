export class validacion {


    validarContrasena(pass: string): boolean {
        const formatoPass: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-/:()&@])[a-zA-Z0-9@\-/:()&]{6,12}$/
        return formatoPass.test(pass);
    }


}