import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PenTool as Tool, Search } from 'lucide-react';
import PageHeader from '../components/Common/PageHeader';
import ActionButton from '../components/Common/ActionButton';
import ComponentCard from '../components/Components/ComponentCard';
import Modal from '../components/Common/Modal';
import ComponentForm from '../components/Components/ComponentForm';
import EmptyState from '../components/Common/EmptyState';
import { useComponents } from '../contexts/ComponentsContext';
import { useShips } from '../contexts/ShipsContext';
import { useAuth } from '../contexts/AuthContext';
import { ShipComponent } from '../types';

const ComponentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { components, isLoading, createComponent } = useComponents();
  const { ships, getShipById } = useShips();
  const { checkPermission } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ShipComponent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShipId, setFilterShipId] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  const canCreate = checkPermission('components', 'create');
  
  useEffect(() => {
    document.title = "Components | ENTNT Marine";
  }, []);
  
  const handleCreateComponent = async (componentData: Omit<ShipComponent, 'id'>) => {
    setIsSubmitting(true);
    try {
      await createComponent(componentData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating component:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleViewComponent = (component: ShipComponent) => {
    setSelectedComponent(component);
    setIsViewModalOpen(true);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterShipId('');
    setFilterCategory('');
    setFilterStatus('');
  };
  
  const filteredComponents = components.filter(component => {
    // Filter by search term
    if (searchTerm && !component.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !component.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by ship
    if (filterShipId && component.shipId !== filterShipId) {
      return false;
    }
    
    // Filter by category
    if (filterCategory && component.category !== filterCategory) {
      return false;
    }
    
    // Filter by status
    if (filterStatus && component.status !== filterStatus) {
      return false;
    }
    
    return true;
  });
  
  // Get unique categories from components
  const categories = Array.from(new Set(components.map(c => c.category).filter(Boolean)));
  
  return (
    <div>
      <PageHeader
        title="Components"
        subtitle="View and manage ship components"
        actions={
          canCreate && (
            <ActionButton
              text="Add Component"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="h-4 w-4" />}
            />
          )
        }
      />
      
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Search by name or serial number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="ship-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Ship
            </label>
            <select
              id="ship-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={filterShipId}
              onChange={(e) => setFilterShipId(e.target.value)}
            >
              <option value="">All Ships</option>
              {ships.map(ship => (
                <option key={ship.id} value={ship.id}>
                  {ship.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              id="category-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="Needs Maintenance">Needs Maintenance</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-500">Loading components...</p>
        </div>
      ) : filteredComponents.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredComponents.map(component => (
            <ComponentCard
              key={component.id}
              component={component}
              onView={handleViewComponent}
              showShipName
              shipName={getShipById(component.shipId)?.name}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No components found"
          message={searchTerm || filterShipId || filterCategory || filterStatus 
            ? "Try adjusting your search terms or filters" 
            : "Add your first component to start managing maintenance"}
          icon={<Tool className="h-6 w-6" />}
          action={
            canCreate && (
              <ActionButton
                text="Add Component"
                onClick={() => setIsModalOpen(true)}
                icon={<Plus className="h-4 w-4" />}
              />
            )
          }
        />
      )}
      
      {/* Create Component Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Component"
      >
        <ComponentForm
          ships={ships}
          onSubmit={handleCreateComponent}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
      
      {/* View Component Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedComponent(null);
        }}
        title={selectedComponent ? `Component: ${selectedComponent.name}` : 'Component Details'}
      >
        {selectedComponent && (
          <div>
            <p className="text-lg mb-4">
              To view complete details and maintenance history, please go to the ship page.
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  navigate(`/ships/${selectedComponent.shipId}`);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                View on Ship Page
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComponentsPage;