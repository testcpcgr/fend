import { ModuleName } from './enum/Module_Enum';

export function renderSwitch(param) {
    console.log(param);
    //alert(param);
    switch(param) {
        case '/SM/ModuleSelection':
            return ModuleName.SMUpload;
        case '/DM/DMDashboardPage':
            return ModuleName.DMDashboard;
        case '/DM/DMCreateActionPage':
            return ModuleName.DMAction;
        case '/DM/DMActionViewPage':
            return ModuleName.DMAction;
        case '/Reports/ReportDashboard?ReportType=Wipsam':
            return ModuleName.ReportWipsam;
        case '/Reports/ReportDashboard?ReportType=WipsamManagement':
            return ModuleName.ReportWipsamManagement;
        case '/Reports/ReportDashboard?ReportType=WipsamPCA':
            return ModuleName.ReportWipsamPCA;
        case '/Reports/ReportDashboard?ReportType=AuditReport':
            return ModuleName.ReportAudit;
        case '/Reports/ReportDashboard?ReportType=PricingTool':
            return ModuleName.ReportPriceReport;
      default:
        return '/';
    }
  }