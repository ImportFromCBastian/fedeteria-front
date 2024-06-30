import { useState } from 'react'
import { ExchangeCodeForm } from './ExchangeCodeForm'
import { ExchangeDetails } from './ExchangeDetails'
import { useHandler } from './hooks/useExchangeHandler'
import { ExchangeSales } from './ExchangeSales'
import { Toaster } from 'sonner'

// state: cp (code pending) | ace (accept or cancel exchange) | s (registering a sale)

export const EstablishExchange = () => {
  const [code, setCode] = useState('')
  const [state, setState] = useState('cp')
  const [exchangeData, setExchangeData] = useState({})
  const { handleChildChange, handleChildSubmit, handleAcceptExchange, handleCancelExchange } =
    useHandler(setCode, setState, code, setExchangeData, exchangeData)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[url('/background-pattern.svg')] bg-cover">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <Toaster richColors={true} />
        <h1 className="mb-4 text-center text-3xl font-bold">Determinar realización de trueque</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Ingresa el código del trueque asignado para determinar si se realizará o no
        </p>
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
        {state === 'rs' && <ExchangeSales />}
      </div>
    </div>
  )
}
