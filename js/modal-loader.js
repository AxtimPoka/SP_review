/**
 * Modal Loader - 統一的Modal組件載入器
 * 用於動態載入和管理所有Modal組件
 */

class ModalLoader {
    constructor() {
        this.modals = {};
        this.modalContainer = null;
        this.init();
    }

    init() {
        // 創建Modal容器
        if (!document.getElementById('modalContainer')) {
            this.modalContainer = document.createElement('div');
            this.modalContainer.id = 'modalContainer';
            document.body.appendChild(this.modalContainer);
        } else {
            this.modalContainer = document.getElementById('modalContainer');
        }
    }

    /**
     * 載入Modal HTML內容
     * @param {string} modalName - Modal名稱 (如 'MODAL_001')
     * @param {string} modalPath - Modal文件路徑
     */
    async loadModal(modalName, modalPath) {
        try {
            // 檢查是否已載入
            if (this.modals[modalName]) {
                return this.modals[modalName];
            }

            // 獲取Modal HTML
            const response = await fetch(modalPath);
            if (!response.ok) {
                throw new Error(`Failed to load modal: ${modalPath}`);
            }
            
            const html = await response.text();
            
            // 解析HTML並提取Modal部分
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 提取Modal主體（假設每個Modal都有特定的ID）
            const modalElement = doc.querySelector('[id*="Modal"]');
            if (modalElement) {
                // 將Modal添加到容器
                this.modalContainer.appendChild(modalElement);
                
                // 提取並執行相關的JavaScript
                const scripts = doc.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script.textContent.includes('class') && script.textContent.includes('Modal')) {
                        // 執行Modal的JavaScript代碼
                        eval(script.textContent);
                    }
                });
                
                // 保存引用
                this.modals[modalName] = modalElement;
                return modalElement;
            }
            
            throw new Error(`Modal structure not found in: ${modalPath}`);
        } catch (error) {
            console.error(`Error loading modal ${modalName}:`, error);
            return null;
        }
    }

    /**
     * 顯示確認對話框
     * @param {Object} options - 配置選項
     */
    showConfirm(options = {}) {
        const defaultOptions = {
            title: '確認',
            message: '您確定要執行此操作嗎？',
            confirmText: '確認',
            cancelText: '取消',
            type: 'default',
            onConfirm: () => {},
            onCancel: () => {}
        };
        
        const config = { ...defaultOptions, ...options };
        
        // 創建簡化的確認對話框
        const modal = this.createSimpleModal('confirm', config);
        document.body.appendChild(modal);
        
        // 顯示Modal
        setTimeout(() => {
            modal.classList.remove('hidden');
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }
        }, 10);
    }

    /**
     * 顯示警告對話框
     * @param {Object} options - 配置選項
     */
    showWarning(options = {}) {
        const defaultOptions = {
            title: '警告',
            message: '請注意此操作可能造成的影響',
            level: 'warning',
            confirmText: '我瞭解了'
        };
        
        const config = { ...defaultOptions, ...options };
        
        // 創建簡化的警告對話框
        const modal = this.createSimpleModal('warning', config);
        document.body.appendChild(modal);
        
        // 顯示Modal
        setTimeout(() => {
            modal.classList.remove('hidden');
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }
        }, 10);
    }

    /**
     * 顯示載入指示器
     * @param {Object} options - 配置選項
     */
    showLoading(options = {}) {
        const defaultOptions = {
            message: '載入中...',
            type: 'spinner'
        };
        
        const config = { ...defaultOptions, ...options };
        
        // 創建簡化的載入指示器
        const modal = this.createSimpleModal('loading', config);
        document.body.appendChild(modal);
        
        // 顯示Modal
        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 10);
        
        return {
            hide: () => this.hideModal(modal)
        };
    }

    /**
     * 創建簡化的Modal
     * @param {string} type - Modal類型
     * @param {Object} config - 配置
     */
    createSimpleModal(type, config) {
        const modalId = `simpleModal_${Date.now()}`;
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 z-50 hidden';
        
        let iconHtml = '';
        let buttonHtml = '';
        
        // 根據類型設置圖標和按鈕
        switch(type) {
            case 'confirm':
                iconHtml = `
                    <div class="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 8.228a4 4 0 015.544 0m0 0l2.828 2.828m-2.828-2.828l2.828-2.828m-2.828 2.828L13 11"></path>
                        </svg>
                    </div>
                `;
                buttonHtml = `
                    <button onclick="modalLoader.confirmAction('${modalId}', true)" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        ${config.confirmText}
                    </button>
                    <button onclick="modalLoader.confirmAction('${modalId}', false)" class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                        ${config.cancelText}
                    </button>
                `;
                break;
                
            case 'warning':
                const warningColor = config.level === 'error' ? 'red' : 'yellow';
                iconHtml = `
                    <div class="w-12 h-12 mx-auto mb-4 bg-${warningColor}-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-${warningColor}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                `;
                buttonHtml = `
                    <button onclick="modalLoader.hideModal(document.getElementById('${modalId}'))" class="w-full px-4 py-2 bg-${warningColor}-600 text-white rounded-lg hover:bg-${warningColor}-700">
                        ${config.confirmText}
                    </button>
                `;
                break;
                
            case 'loading':
                iconHtml = `
                    <div class="w-16 h-16 mx-auto mb-4">
                        <div class="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                `;
                buttonHtml = '';
                break;
        }
        
        // 設置Modal HTML
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div class="absolute inset-0 flex items-center justify-center p-4">
                <div class="modal-content bg-white rounded-xl p-6 max-w-sm w-full shadow-xl transform transition-all duration-300 scale-95 opacity-0">
                    ${iconHtml}
                    ${config.title ? `<h3 class="text-lg font-bold text-gray-800 text-center mb-2">${config.title}</h3>` : ''}
                    <p class="text-gray-600 text-center mb-6">${config.message}</p>
                    ${buttonHtml ? `<div class="flex space-x-3">${buttonHtml}</div>` : ''}
                </div>
            </div>
        `;
        
        // 保存配置
        modal.dataset.config = JSON.stringify(config);
        
        return modal;
    }

    /**
     * 處理確認動作
     * @param {string} modalId - Modal ID
     * @param {boolean} confirmed - 是否確認
     */
    confirmAction(modalId, confirmed) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const config = JSON.parse(modal.dataset.config || '{}');
        
        if (confirmed && config.onConfirm) {
            config.onConfirm();
        } else if (!confirmed && config.onCancel) {
            config.onCancel();
        }
        
        this.hideModal(modal);
    }

    /**
     * 隱藏Modal
     * @param {HTMLElement} modal - Modal元素
     */
    hideModal(modal) {
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');
        }
        
        setTimeout(() => {
            modal.classList.add('hidden');
            // 如果是臨時創建的Modal，移除它
            if (modal.id.startsWith('simpleModal_')) {
                modal.remove();
            }
        }, 300);
    }

    /**
     * 顯示成交確認
     * @param {Object} options - 配置選項
     */
    showCaseSuccess(options = {}) {
        const defaultOptions = {
            customerName: '客戶',
            caseName: 'CASE',
            onSubmit: (data) => {
                console.log('Case success data:', data);
            }
        };
        
        const config = { ...defaultOptions, ...options };
        
        // 這裡可以載入MODAL_011或創建簡化版本
        // 為了簡化，我們創建一個基本版本
        alert(`恭喜成交！\n客戶：${config.customerName}\nCASE：${config.caseName}`);
    }

    /**
     * 顯示操作選單
     * @param {Object} options - 配置選項
     */
    showActionSheet(options = {}) {
        const defaultOptions = {
            title: '選擇操作',
            actions: [],
            onSelect: (action) => {}
        };
        
        const config = { ...defaultOptions, ...options };
        
        // 創建操作選單
        const modal = this.createActionSheet(config);
        document.body.appendChild(modal);
        
        // 顯示Modal
        setTimeout(() => {
            modal.classList.remove('hidden');
            const content = modal.querySelector('.action-sheet');
            if (content) {
                content.classList.remove('translate-y-full');
                content.classList.add('translate-y-0');
            }
        }, 10);
    }

    /**
     * 創建操作選單
     * @param {Object} config - 配置
     */
    createActionSheet(config) {
        const modalId = `actionSheet_${Date.now()}`;
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 z-50 hidden';
        
        const actionsHtml = config.actions.map((action, index) => `
            <button onclick="modalLoader.selectAction('${modalId}', ${index})" 
                    class="w-full py-4 text-left px-6 hover:bg-gray-50 transition-colors ${action.destructive ? 'text-red-600' : 'text-gray-800'}">
                ${action.icon ? `<span class="mr-3">${action.icon}</span>` : ''}
                ${action.text}
            </button>
        `).join('');
        
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black bg-opacity-50" onclick="modalLoader.hideActionSheet('${modalId}')"></div>
            <div class="absolute bottom-0 left-0 right-0">
                <div class="action-sheet bg-white rounded-t-2xl transform transition-transform duration-300 translate-y-full">
                    ${config.title ? `
                        <div class="py-3 px-6 border-b border-gray-200">
                            <h3 class="text-sm text-gray-500 text-center">${config.title}</h3>
                        </div>
                    ` : ''}
                    <div class="divide-y divide-gray-200">
                        ${actionsHtml}
                    </div>
                    <div class="border-t-8 border-gray-100">
                        <button onclick="modalLoader.hideActionSheet('${modalId}')" 
                                class="w-full py-4 text-center text-blue-600 font-medium hover:bg-gray-50">
                            取消
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // 保存配置
        modal.dataset.config = JSON.stringify(config);
        
        return modal;
    }

    /**
     * 選擇操作
     * @param {string} modalId - Modal ID
     * @param {number} actionIndex - 操作索引
     */
    selectAction(modalId, actionIndex) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const config = JSON.parse(modal.dataset.config || '{}');
        const action = config.actions[actionIndex];
        
        if (action && config.onSelect) {
            config.onSelect(action);
        }
        
        this.hideActionSheet(modalId);
    }

    /**
     * 隱藏操作選單
     * @param {string} modalId - Modal ID
     */
    hideActionSheet(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        const content = modal.querySelector('.action-sheet');
        if (content) {
            content.classList.remove('translate-y-0');
            content.classList.add('translate-y-full');
        }
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.remove();
        }, 300);
    }
}

// 創建全局實例
const modalLoader = new ModalLoader();

// 導出給其他模組使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalLoader;
}