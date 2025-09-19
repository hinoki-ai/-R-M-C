export default function FAQs() {
    return (
        <section className='scroll-py-16 py-16 md:scroll-py-32 md:py-32'>
            <div className='mx-auto max-w-5xl px-6'>
                <div className='grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]'>
                    <div className='text-center lg:text-left'>
                        <h2 className='mb-4 text-3xl font-semibold md:text-4xl'>
                            Preguntas <br className='hidden lg:block' /> Frecuentes <br className='hidden lg:block' />
                            sobre la Junta
                        </h2>
                        <p>Preguntas comunes sobre la plataforma de Pinto Los Pellines</p>
                    </div>

                    <div className='divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0'>
                        <div className='pb-6'>
                            <h3 className='font-medium'>¿Cómo me registro en la plataforma?</h3>
                            <p className='text-muted-foreground mt-4'>Solo necesitas crear una cuenta con tu email. Si eres vecino de Pinto Los Pellines, podrás acceder a todas las funciones comunitarias.</p>
                        </div>
                        <div className='py-6'>
                            <h3 className='font-medium'>¿Qué puedo hacer en la plataforma?</h3>
                            <p className='text-muted-foreground mt-4'>Reportar problemas del barrio, ver anuncios oficiales, participar en eventos comunitarios, gestionar tus aportes mensuales y conectarte con otros vecinos.</p>
                        </div>
                        <div className='py-6'>
                            <h3 className='font-medium'>¿Cómo reporto un problema?</h3>
                            <p className='text-muted-foreground mt-4'>Ve a la sección &quot;Mantenimiento&quot; en tu dashboard, describe el problema (baches, alumbrado, basura, etc.) y opcionalmente añade fotos. La Junta lo revisará.</p>
                        </div>
                        <div className='py-6'>
                            <h3 className='font-medium'>¿Cómo pago mis aportes mensuales?</h3>
                            <p className='text-muted-foreground mt-4'>En la sección &quot;Aportes&quot; puedes ver el monto pendiente y realizar el pago de forma segura a través de la plataforma.</p>
                        </div>
                        <div className='py-6'>
                            <h3 className='font-medium'>¿Cómo me entero de las reuniones de la Junta?</h3>
                            <p className='text-muted-foreground mt-4'>Todas las reuniones y asambleas se anuncian en la sección &quot;Anuncios&quot; y también se envían notificaciones. Puedes ver el calendario completo en &quot;Eventos&quot;.</p>
                        </div>
                        <div className='py-6'>
                            <h3 className='font-medium'>¿Qué documentos puedo consultar?</h3>
                            <p className='text-muted-foreground mt-4'>En &quot;Documentos&quot; encontrarás el estatuto de la Junta, actas de reuniones, presupuestos, informes financieros y otros documentos oficiales de Pinto Los Pellines.</p>
                        </div>
                        <div className='py-6'>
                            <h3 className='font-medium'>¿Cómo contacto a la directiva?</h3>
                            <p className='text-muted-foreground mt-4'>Puedes enviar mensajes directos a través de la sección &quot;Mensajes&quot; o contactar a través del directorio comunitario en la sección &quot;Contactos&quot;. Para emergencias, utiliza los contactos de servicios municipales disponibles en el directorio.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
