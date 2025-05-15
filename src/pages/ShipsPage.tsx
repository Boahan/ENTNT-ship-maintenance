import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../components/Common/PageHeader';
import ActionButton from '../components/Common/ActionButton';
import ShipCard from '../components/Ships/ShipCard';
import Modal from '../components/Common/Modal';
import ShipForm from '../components/Ships/ShipForm';
import { useShips } from '../contexts/ShipsContext';
import { useAuth } from '../contexts/AuthContext';
import EmptyState from '../components/Common/EmptyState';
import { Ship as ShipIcon } from 'lucide-react';

const ShipsPage: React.FC = () => {
  const { ships, isLoading, createShip } = useShips();
  const { checkPermission } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const canCreate = checkPermission('ships', 'create');
  
  useEffect(() => {
    document.title = "Ships | ENTNT Marine";
  }, []);
  
  const handleCreateShip = async (shipData: Omit<Ship, 'id'>) => {
    setIsSubmitting(true);
    try {
      await createShip(shipData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating ship:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredShips = ships.filter(ship => 
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.imo.includes(searchTerm) ||
    ship.flag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Ships"
        subtitle="Manage your fleet details and maintenance status"
        actions={
          canCreate && (
            <ActionButton
              text="Add Ship"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="h-4 w-4" />}
            />
          )
        }
      />
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-4 pr-12 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            placeholder="Search ships by name, IMO number or flag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm text-gray-400">
              Search
            </kbd>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-500">Loading ships...</p>
        </div>
      ) : filteredShips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShips.map((ship) => (
            <ShipCard key={ship.id} ship={ship} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No ships found"
          message={searchTerm ? "Try adjusting your search terms" : "Add your first ship to start managing your fleet"}
          icon={<ShipIcon className="h-6 w-6" />}
          action={
            canCreate && (
              <ActionButton
                text="Add Ship"
                onClick={() => setIsModalOpen(true)}
                icon={<Plus className="h-4 w-4" />}
              />
            )
          }
        />
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Ship"
      >
        <ShipForm
          onSubmit={handleCreateShip}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ShipsPage;