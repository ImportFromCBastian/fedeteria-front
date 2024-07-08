import { useState } from 'react'
import { ExchangeCodeForm } from './ExchangeCodeForm'
import { ExchangeDetails } from './ExchangeDetails'
import { useHandler } from './hooks/useExchangeHandler'
import { ExchangeSales } from './ExchangeSales'
import { Toaster } from 'sonner'

// state: cp (code pending) | ace (accept or cancel exchange) | rs (registering a sale)

export const EstablishExchange = () => {
  const [code, setCode] = useState('')
  const [state, setState] = useState('cp')
  const [exchangeData, setExchangeData] = useState({})
  const { handleChildChange, handleChildSubmit, handleAcceptExchange, handleCancelExchange } =
    useHandler(setCode, setState, code, setExchangeData, exchangeData)

  return (
    <div className="flex min-h-screen flex-col items-center  border bg-cover">
      <div className="m-10 w-full max-w-5xl rounded-lg border-2  border-fede-main bg-white p-8 shadow-lg">
        <Toaster richColors={true} />
        {state != 'rs' ? (
          <>
            <h1 className="mb-4 text-center text-3xl font-bold">
              Determinar realización de trueque
            </h1>
            <p className="text-muted-foreground mb-8 text-center">
              Ingresa el código del trueque asignado para determinar si se realizará o no
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-center text-3xl font-bold">
              Realizando venta durante el trueque
            </h1>
            <p className="text-muted-foreground mb-8 text-center">
              Ingresa los productos que los clientes del intercambio desean comprar
            </p>
          </>
        )}

        {/* TODO: ADD toaster and toast to show each error in the useHanlder file */}
        {state === 'cp' && (
          <ExchangeCodeForm childSubmit={handleChildSubmit} childChange={handleChildChange} />
        )}
        {state === 'ace' && (
          <ExchangeDetails
            exchangeData={exchangeData}
            childAccept={handleAcceptExchange}
            childCancel={handleCancelExchange}
          />
        )}
        {state === 'rs' && <ExchangeSales exchangeData={exchangeData} />}
      </div>
    </div>
  )
}
