import React from 'react'
import { AresCompany } from '@/types/aresCompany'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface AresResponseDisplayProps {
  aresData: AresCompany
}

const AresResponseDisplay: React.FC<AresResponseDisplayProps> = ({ aresData }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>ARES Data</span>
          <Badge variant="secondary">Auto-filled</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Company Information</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{aresData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">ICO:</span>
                <span className="text-sm">{aresData.ico}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">DIC:</span>
                <span className="text-sm">{aresData.dic}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">Address Information</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Street:</span>
                <span className="text-sm">{aresData.residence.street} {aresData.residence.houseNumber}{aresData.residence.referenceNumber ? `/${aresData.residence.referenceNumber}` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">City:</span>
                <span className="text-sm">{aresData.residence.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Postal Code:</span>
                <span className="text-sm">{aresData.residence.zipCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Country:</span>
                <span className="text-sm">{aresData.residence.state}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div>
          <h4 className="font-semibold text-sm text-gray-600 mb-2">Full Address</h4>
          <p className="text-sm bg-gray-50 p-2 rounded">{aresData.residence.fullAddress}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AresResponseDisplay
