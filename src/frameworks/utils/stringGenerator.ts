
import randomstring from 'randomstring'

import  RandomStr from '../../usecase/interfaces/users/IRandomStr'

class StringGenerator implements RandomStr{
    randomstring(){
        
        const randomStrng=randomstring.generate()
        
        return randomStrng
    }
}


export default StringGenerator