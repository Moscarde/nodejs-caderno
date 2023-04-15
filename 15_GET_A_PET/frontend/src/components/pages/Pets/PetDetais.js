import styles from './PetDetails.module.css'

import api from '../../../utils/api'

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// Hooks
import useFlashMessage from '../../../hooks/useFlashMessage'

function PetDetails() {
    const [pet, setPet] = useState({})
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()
    const [token] = useState(localStorage.getItem('token') || '')


    useEffect(() => {
        api.get(`/pets/${id}`).then(res => {
            setPet(res.data.pet)
        })
    }, [id])

    return (
        <>
            {pet.name && (
                <section>
                    <div>
                        <h1>Conhecendo o Pet: {pet.name}</h1>
                        <p>Se tiver interesse, marque uma visita para conhece-lo</p>
                    </div>
                    <div>
                        {pet.images.map((image, index) => (
                            <img
                                src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                                alt={pet.name}
                                key={index}
                            />
                        ))}
                    </div>
                    <p><span className='bold'>Peso: {pet.weight}kg</span></p>
                    <p><span className='bold'>Idade: {pet.age}anos</span></p>
                    {token ?
                        (
                            <button>Solicitar uma visita</button>
                        ) : (
                            <p>Você precisa <Link to="/register">criar uma conta</Link> para solicitar a visita</p>
                        )}
                </section>
            )}

        </>
    )
}

export default PetDetails