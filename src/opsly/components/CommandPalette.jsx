import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiUser, FiBriefcase, FiCheckSquare, FiFileText } from 'react-icons/fi';
import api from '../services/api';

export function CommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ customers: [], projects: [], tasks: [], invoices: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Load dataset for search
  const [data, setData] = useState({ customers: [], projects: [], tasks: [], invoices: [] });

  useEffect(() => {
    if (isOpen) {
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);

      // Fetch all fresh search data
      Promise.all([
        api.getCustomers().catch(() => []),
        api.getProjects().catch(() => []),
        api.getTasks().catch(() => []),
        api.getInvoices().catch(() => [])
      ]).then(([customers, projects, tasks, invoices]) => {
        setData({ customers, projects, tasks, invoices });
      });
    }
  }, [isOpen]);

  // Handle Search Filtering
  useEffect(() => {
    if (!query) {
      setResults({ customers: [], projects: [], tasks: [], invoices: [] });
      return;
    }

    const q = query.toLowerCase();
    
    const filteredCustomers = data.customers.filter(
      c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredProjects = data.projects.filter(
      p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredTasks = data.tasks.filter(
      t => t.name.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredInvoices = data.invoices.filter(
      i => i.invoiceNumber.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)
    ).slice(0, 3);

    setResults({
      customers: filteredCustomers,
      projects: filteredProjects,
      tasks: filteredTasks,
      invoices: filteredInvoices
    });
    setSelectedIndex(0);
  }, [query, data]);

  // Flattened results list for keyboard indexing
  const flatResults = [
    ...results.customers.map(c => ({ type: 'customer', id: c.id, title: c.name, subtitle: c.company, link: 'customers', param: c.id })),
    ...results.projects.map(p => ({ type: 'project', id: p.id, title: p.name, subtitle: `Budget: $${p.budget.toLocaleString()}`, link: 'projects', param: p.id })),
    ...results.tasks.map(t => ({ type: 'task', id: t.id, title: t.name, subtitle: `Priority: ${t.priority}`, link: 'tasks' })),
    ...results.invoices.map(i => ({ type: 'invoice', id: i.id, title: i.invoiceNumber, subtitle: `Amount: $${i.amount.toLocaleString()}`, link: 'invoices', param: i.id }))
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatResults.length) % Math.max(1, flatResults.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          const item = flatResults[selectedIndex];
          onNavigate(item.link, item.param);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResults, selectedIndex]);

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'customer': return <FiUser size={14} />;
      case 'project': return <FiBriefcase size={14} />;
      case 'task': return <FiCheckSquare size={14} />;
      case 'invoice': return <FiFileText size={14} />;
      default: return <FiSearch size={14} />;
    }
  };

  return (
    <div className="opsly-command-palette-backdrop" onClick={onClose}>
      <div className="opsly-command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="opsly-command-palette-search">
          <FiSearch size={18} color="var(--opsly-text-muted)" />
          <input
            ref={inputRef}
            type="text"
            className="opsly-command-palette-input"
            placeholder="Search customers, projects, invoices, or tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="opsly-command-palette-results">
          {query === '' ? (
            <div className="opsly-command-palette-empty">
              Type to start searching...
            </div>
          ) : flatResults.length === 0 ? (
            <div className="opsly-command-palette-empty">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div>
              {results.customers.length > 0 && (
                <div>
                  <div className="opsly-command-palette-group-title">Customers</div>
                  {results.customers.map((c, i) => {
                    const idx = flatResults.findIndex(r => r.type === 'customer' && r.id === c.id);
                    return (
                      <div
                        key={c.id}
                        className={`opsly-command-palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                        onClick={() => { onNavigate('customers', c.id); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="opsly-command-palette-item-left">
                          {getIcon('customer')}
                          <span className="opsly-command-palette-item-title">{c.name}</span>
                          <span className="opsly-command-palette-item-subtitle">{c.company}</span>
                        </div>
                        <span className="opsly-command-palette-item-tag">Customer</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {results.projects.length > 0 && (
                <div>
                  <div className="opsly-command-palette-group-title">Projects</div>
                  {results.projects.map((p, i) => {
                    const idx = flatResults.findIndex(r => r.type === 'project' && r.id === p.id);
                    return (
                      <div
                        key={p.id}
                        className={`opsly-command-palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                        onClick={() => { onNavigate('projects', p.id); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="opsly-command-palette-item-left">
                          {getIcon('project')}
                          <span className="opsly-command-palette-item-title">{p.name}</span>
                          <span className="opsly-command-palette-item-subtitle">{p.status}</span>
                        </div>
                        <span className="opsly-command-palette-item-tag">Project</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {results.tasks.length > 0 && (
                <div>
                  <div className="opsly-command-palette-group-title">Tasks</div>
                  {results.tasks.map((t, i) => {
                    const idx = flatResults.findIndex(r => r.type === 'task' && r.id === t.id);
                    return (
                      <div
                        key={t.id}
                        className={`opsly-command-palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                        onClick={() => { onNavigate('tasks'); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="opsly-command-palette-item-left">
                          {getIcon('task')}
                          <span className="opsly-command-palette-item-title">{t.name}</span>
                          <span className="opsly-command-palette-item-subtitle">Status: {t.status}</span>
                        </div>
                        <span className="opsly-command-palette-item-tag">Task</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {results.invoices.length > 0 && (
                <div>
                  <div className="opsly-command-palette-group-title">Invoices</div>
                  {results.invoices.map((inv, i) => {
                    const idx = flatResults.findIndex(r => r.type === 'invoice' && r.id === inv.id);
                    return (
                      <div
                        key={inv.id}
                        className={`opsly-command-palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                        onClick={() => { onNavigate('invoices', inv.id); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="opsly-command-palette-item-left">
                          {getIcon('invoice')}
                          <span className="opsly-command-palette-item-title">{inv.invoiceNumber}</span>
                          <span className="opsly-command-palette-item-subtitle">Amount: ${inv.amount.toLocaleString()}</span>
                        </div>
                        <span className="opsly-command-palette-item-tag">Invoice</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="opsly-command-palette-footer">
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}
export default CommandPalette;
